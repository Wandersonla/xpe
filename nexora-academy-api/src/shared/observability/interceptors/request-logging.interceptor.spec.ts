import { RequestLoggingInterceptor } from './request-logging.interceptor';
import { of } from 'rxjs';

describe('RequestLoggingInterceptor', () => {
  let interceptor: RequestLoggingInterceptor;

  beforeEach(() => {
    interceptor = new RequestLoggingInterceptor();
    jest.spyOn((interceptor as any).logger, 'log').mockImplementation(() => undefined);
  });

  it('should pass through the response data unchanged', (done) => {
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ method: 'GET', originalUrl: '/api/v1/health' }),
        getResponse: jest.fn().mockReturnValue({ statusCode: 200 }),
      }),
    } as any;

    const next = { handle: () => of({ status: 'ok' }) };

    interceptor.intercept(context, next).subscribe((result: any) => {
      expect(result).toEqual({ status: 'ok' });
      done();
    });
  });

  it('should call logger.log after response', (done) => {
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ method: 'POST', originalUrl: '/api/v1/users' }),
        getResponse: jest.fn().mockReturnValue({ statusCode: 201 }),
      }),
    } as any;

    const next = { handle: () => of({}) };

    interceptor.intercept(context, next).subscribe(() => {
      expect((interceptor as any).logger.log).toHaveBeenCalledWith(
        expect.stringContaining('POST /api/v1/users -> 201'),
      );
      done();
    });
  });
});
