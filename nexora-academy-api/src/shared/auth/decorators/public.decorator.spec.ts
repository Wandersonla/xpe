import { IS_PUBLIC_KEY, Public } from './public.decorator';

describe('Public decorator', () => {
  it('should set IS_PUBLIC_KEY metadata to true', () => {
    class FakeController {}
    const decorator = Public();
    (decorator as ClassDecorator)(FakeController);

    const metadata = Reflect.getMetadata(IS_PUBLIC_KEY, FakeController);

    expect(metadata).toBe(true);
  });

  it('should export IS_PUBLIC_KEY as isPublic', () => {
    expect(IS_PUBLIC_KEY).toBe('isPublic');
  });
});
