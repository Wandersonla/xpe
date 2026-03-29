import { ResponseEnvelopeInterceptor } from './response-envelope.interceptor';
import { of } from 'rxjs';

describe('ResponseEnvelopeInterceptor', () => {
  let interceptor: ResponseEnvelopeInterceptor;

  const mockSetHeader = jest.fn();

  function buildContext(correlationId?: string) {
    return {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: correlationId ? { 'x-correlation-id': correlationId } : {},
        }),
        getResponse: jest.fn().mockReturnValue({
          setHeader: mockSetHeader,
        }),
      }),
    } as any;
  }

  beforeEach(() => {
    interceptor = new ResponseEnvelopeInterceptor();
    mockSetHeader.mockClear();
  });

  it('should wrap response data in envelope', (done) => {
    const context = buildContext();
    const next = { handle: () => of({ id: 1 }) };

    interceptor.intercept(context, next).subscribe((result: any) => {
      expect(result.data).toEqual({ id: 1 });
      expect(result.meta).toBeDefined();
      expect(result.meta.correlationId).toBeDefined();
      expect(result.meta.timestamp).toBeDefined();
      done();
    });
  });

  it('should use x-correlation-id from request headers when present', (done) => {
    const correlationId = 'test-correlation-id-123';
    const context = buildContext(correlationId);
    const next = { handle: () => of(null) };

    interceptor.intercept(context, next).subscribe((result: any) => {
      expect(result.meta.correlationId).toBe(correlationId);
      expect(mockSetHeader).toHaveBeenCalledWith('x-correlation-id', correlationId);
      done();
    });
  });

  it('should generate a correlationId when not in headers', (done) => {
    const context = buildContext();
    const next = { handle: () => of(null) };

    interceptor.intercept(context, next).subscribe((result: any) => {
      expect(result.meta.correlationId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
      );
      done();
    });
  });

  it('should set x-correlation-id header on response', (done) => {
    const context = buildContext();
    const next = { handle: () => of('hello') };

    interceptor.intercept(context, next).subscribe(() => {
      expect(mockSetHeader).toHaveBeenCalledWith('x-correlation-id', expect.any(String));
      done();
    });
  });

  it('should include a valid ISO timestamp in meta', (done) => {
    const context = buildContext();
    const next = { handle: () => of([]) };

    interceptor.intercept(context, next).subscribe((result: any) => {
      expect(() => new Date(result.meta.timestamp)).not.toThrow();
      expect(new Date(result.meta.timestamp).toISOString()).toBe(result.meta.timestamp);
      done();
    });
  });
});
