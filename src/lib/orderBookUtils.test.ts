import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  calculateDepthPercentage,
  normalizeDataForOrderbook,
  createOrderbookHandlers,
} from './orderBookUtils';
import { type OrderbookInterface } from '@/types/api/trading';
import { ORDER_SIDE, ORDER_TYPE } from '@/types/trading';
import { toast } from 'sonner';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe('calculateDepthPercentage', () => {
  it('should calculate percentage correctly', () => {
    expect(calculateDepthPercentage(50, 100)).toBe(50);
    expect(calculateDepthPercentage(25, 100)).toBe(25);
    expect(calculateDepthPercentage(100, 100)).toBe(100);
  });

  it('should handle decimal values', () => {
    expect(calculateDepthPercentage(33.33, 100)).toBe(33.33);
    expect(calculateDepthPercentage(66.66, 100)).toBe(66.66);
  });

  it('should handle zero total', () => {
    expect(calculateDepthPercentage(0, 100)).toBe(0);
  });

  it('should handle values greater than max', () => {
    expect(calculateDepthPercentage(150, 100)).toBe(150);
  });

  it('should handle very small percentages', () => {
    expect(calculateDepthPercentage(1, 1000)).toBe(0.1);
    expect(calculateDepthPercentage(0.5, 100)).toBe(0.5);
  });
});

describe('normalizeDataForOrderbook', () => {
  it('should return null when data is undefined', () => {
    expect(normalizeDataForOrderbook(undefined)).toBe(null);
  });

  it('should sort bids in descending order by price', () => {
    const data: OrderbookInterface = {
      lastUpdateId: 123,
      bids: [
        { price: 100, quantity: 1 },
        { price: 150, quantity: 1 },
        { price: 120, quantity: 1 },
      ],
      asks: [],
    };

    const result = normalizeDataForOrderbook(data);
    expect(result?.bids[0].price).toBe(150);
    expect(result?.bids[1].price).toBe(120);
    expect(result?.bids[2].price).toBe(100);
  });

  it('should sort asks in ascending order by price', () => {
    const data: OrderbookInterface = {
      lastUpdateId: 123,
      bids: [],
      asks: [
        { price: 200, quantity: 1 },
        { price: 180, quantity: 1 },
        { price: 190, quantity: 1 },
      ],
    };

    const result = normalizeDataForOrderbook(data);
    expect(result?.asks[0].price).toBe(180);
    expect(result?.asks[1].price).toBe(190);
    expect(result?.asks[2].price).toBe(200);
  });

  it('should calculate total for each entry', () => {
    const data: OrderbookInterface = {
      lastUpdateId: 123,
      bids: [{ price: 100, quantity: 2 }],
      asks: [{ price: 200, quantity: 3 }],
    };

    const result = normalizeDataForOrderbook(data);
    expect(result?.bids[0].total).toBe(200);
    expect(result?.asks[0].total).toBe(600);
  });

  it('should calculate depth percentage correctly', () => {
    const data: OrderbookInterface = {
      lastUpdateId: 123,
      bids: [
        { price: 100, quantity: 5 },
        { price: 100, quantity: 2.5 },
      ],
      asks: [
        { price: 200, quantity: 4 },
        { price: 200, quantity: 2 },
      ],
    };

    const result = normalizeDataForOrderbook(data);

    expect(result?.bids[0].depthPercent).toBe(100);
    expect(result?.bids[1].depthPercent).toBe(50);

    expect(result?.asks[0].depthPercent).toBe(100);
    expect(result?.asks[1].depthPercent).toBe(50);
  });

  it('should handle single bid and ask', () => {
    const data: OrderbookInterface = {
      lastUpdateId: 123,
      bids: [{ price: 100, quantity: 1 }],
      asks: [{ price: 200, quantity: 1 }],
    };

    const result = normalizeDataForOrderbook(data);
    expect(result).not.toBe(null);
    expect(result?.bids.length).toBe(1);
    expect(result?.asks.length).toBe(1);
    expect(result?.bids[0].depthPercent).toBe(100);
    expect(result?.asks[0].depthPercent).toBe(100);
  });

  it('should preserve original entry properties', () => {
    const data: OrderbookInterface = {
      lastUpdateId: 123,
      bids: [{ price: 100, quantity: 2 }],
      asks: [{ price: 200, quantity: 3 }],
    };

    const result = normalizeDataForOrderbook(data);

    expect(result?.bids[0].price).toBe(100);
    expect(result?.bids[0].quantity).toBe(2);
    expect(result?.asks[0].price).toBe(200);
    expect(result?.asks[0].quantity).toBe(3);
  });

  it('should handle empty bids array', () => {
    const data: OrderbookInterface = {
      lastUpdateId: 123,
      bids: [],
      asks: [{ price: 200, quantity: 1 }],
    };

    const result = normalizeDataForOrderbook(data);
    expect(result?.bids.length).toBe(0);
    expect(result?.asks.length).toBe(1);
  });

  it('should handle empty asks array', () => {
    const data: OrderbookInterface = {
      lastUpdateId: 123,
      bids: [{ price: 100, quantity: 1 }],
      asks: [],
    };

    const result = normalizeDataForOrderbook(data);
    expect(result?.bids.length).toBe(1);
    expect(result?.asks.length).toBe(0);
  });

  it('should handle complex orderbook data', () => {
    const data: OrderbookInterface = {
      lastUpdateId: 456,
      bids: [
        { price: 50000, quantity: 0.5 },
        { price: 49950, quantity: 1.2 },
        { price: 50100, quantity: 0.8 },
      ],
      asks: [
        { price: 50200, quantity: 0.6 },
        { price: 50150, quantity: 1.5 },
        { price: 50300, quantity: 0.3 },
      ],
    };

    const result = normalizeDataForOrderbook(data);

    expect(result?.bids[0].price).toBe(50100);
    expect(result?.bids[2].price).toBe(49950);

    expect(result?.asks[0].price).toBe(50150);
    expect(result?.asks[2].price).toBe(50300);

    expect(result?.bids[0].total).toBe(50100 * 0.8);
    expect(result?.asks[0].total).toBe(50150 * 1.5);

    expect(result?.bids.every(bid => bid.depthPercent <= 100)).toBe(true);
    expect(result?.asks.every(ask => ask.depthPercent <= 100)).toBe(true);
  });

  it('should handle decimal quantities and prices', () => {
    const data: OrderbookInterface = {
      lastUpdateId: 789,
      bids: [
        { price: 0.001, quantity: 1000.5 },
        { price: 0.002, quantity: 500.25 },
      ],
      asks: [
        { price: 0.003, quantity: 333.33 },
        { price: 0.004, quantity: 250.5 },
      ],
    };

    const result = normalizeDataForOrderbook(data);

    expect(result?.bids[0].total).toBeCloseTo(0.002 * 500.25, 5);
    expect(result?.bids[1].total).toBeCloseTo(0.001 * 1000.5, 5);

    expect(result?.asks[0].total).toBeCloseTo(0.003 * 333.33, 5);
    expect(result?.asks[1].total).toBeCloseTo(0.004 * 250.5, 5);
  });
});

describe('createOrderbookHandlers', () => {
  const mockWatch = vi.fn();
  const mockSetValue = vi.fn();
  const mockOnSubmitOrder = vi.fn();
  const mockT = vi.fn((key: string) => key);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleAskClick (BUY order)', () => {
    it('should submit order immediately when quantity is filled', () => {
      mockWatch.mockReturnValue('2.5');

      const handlers = createOrderbookHandlers({
        symbol: 'BTC',
        watch: mockWatch,
        setValue: mockSetValue,
        onSubmitOrder: mockOnSubmitOrder,
        t: mockT,
      });

      handlers.handleAskClick('50000');

      expect(mockWatch).toHaveBeenCalledWith('quantity');
      expect(mockOnSubmitOrder).toHaveBeenCalledWith({
        asset: 'BTC',
        side: ORDER_SIDE.BUY,
        type: ORDER_TYPE.LIMIT,
        quantity: 2.5,
        price: 50000,
        notional: 125000,
      });
      expect(mockSetValue).not.toHaveBeenCalled();
      expect(toast.success).not.toHaveBeenCalled();
    });

    it('should fill form and show toast when quantity is empty', () => {
      mockWatch.mockReturnValue('');

      const handlers = createOrderbookHandlers({
        symbol: 'BTC',
        watch: mockWatch,
        setValue: mockSetValue,
        onSubmitOrder: mockOnSubmitOrder,
        t: mockT,
      });

      handlers.handleAskClick('50000');

      expect(mockWatch).toHaveBeenCalledWith('quantity');
      expect(mockSetValue).toHaveBeenCalledWith('price', '50000');
      expect(mockSetValue).toHaveBeenCalledWith('orderType', ORDER_TYPE.LIMIT);
      expect(mockSetValue).toHaveBeenCalledWith('orderSide', ORDER_SIDE.BUY);
      expect(mockOnSubmitOrder).not.toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('orderForm.formFilled', {
        description: 'orderForm.formFilledDescription',
      });
    });

    it('should fill form when quantity is zero', () => {
      mockWatch.mockReturnValue('0');

      const handlers = createOrderbookHandlers({
        symbol: 'ETH',
        watch: mockWatch,
        setValue: mockSetValue,
        onSubmitOrder: mockOnSubmitOrder,
        t: mockT,
      });

      handlers.handleAskClick('3000');

      expect(mockSetValue).toHaveBeenCalledWith('price', '3000');
      expect(mockSetValue).toHaveBeenCalledWith('orderSide', ORDER_SIDE.BUY);
      expect(mockOnSubmitOrder).not.toHaveBeenCalled();
    });
  });

  describe('handleBidClick (SELL order)', () => {
    it('should submit SELL order when quantity is filled', () => {
      mockWatch.mockReturnValue('1.5');

      const handlers = createOrderbookHandlers({
        symbol: 'BTC',
        watch: mockWatch,
        setValue: mockSetValue,
        onSubmitOrder: mockOnSubmitOrder,
        t: mockT,
      });

      handlers.handleBidClick('49500');

      expect(mockWatch).toHaveBeenCalledWith('quantity');
      expect(mockOnSubmitOrder).toHaveBeenCalledWith({
        asset: 'BTC',
        side: ORDER_SIDE.SELL,
        type: ORDER_TYPE.LIMIT,
        quantity: 1.5,
        price: 49500,
        notional: 74250,
      });
      expect(mockSetValue).not.toHaveBeenCalled();
    });

    it('should fill form with SELL side when quantity is empty', () => {
      mockWatch.mockReturnValue(undefined);

      const handlers = createOrderbookHandlers({
        symbol: 'ETH',
        watch: mockWatch,
        setValue: mockSetValue,
        onSubmitOrder: mockOnSubmitOrder,
        t: mockT,
      });

      handlers.handleBidClick('2950');

      expect(mockSetValue).toHaveBeenCalledWith('price', '2950');
      expect(mockSetValue).toHaveBeenCalledWith('orderType', ORDER_TYPE.LIMIT);
      expect(mockSetValue).toHaveBeenCalledWith('orderSide', ORDER_SIDE.SELL);
      expect(mockOnSubmitOrder).not.toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalled();
    });
  });
});
