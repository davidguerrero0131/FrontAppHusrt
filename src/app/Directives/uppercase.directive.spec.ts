import { UppercaseDirective } from './uppercase.directive';

describe('UppercaseDirective', () => {
  it('should create an instance', () => {
    const directive = new UppercaseDirective(null as any);
    expect(directive).toBeTruthy();
  });
});
