import { cn } from '../../lib/utils';

describe('Utils', () => {
  describe('cn 函数', () => {
    it('合并多个类名字符串', () => {
      const result = cn('class1', 'class2', 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('过滤掉假值', () => {
      const result = cn('class1', false && 'class2', null, undefined, 0, 'class3');
      expect(result).toBe('class1 class3');
    });

    it('处理条件类名', () => {
      const isActive = true;
      const isDisabled = false;
      
      const result = cn(
        'base-class',
        isActive && 'active',
        isDisabled && 'disabled'
      );
      
      expect(result).toBe('base-class active');
    });

    it('处理类名对象', () => {
      const result = cn('base-class', {
        'active': true,
        'disabled': false,
        'hidden': true
      });
      
      expect(result).toContain('base-class');
      expect(result).toContain('active');
      expect(result).toContain('hidden');
      expect(result).not.toContain('disabled');
    });

    it('处理嵌套数组', () => {
      const result = cn('base-class', ['nested1', 'nested2', ['deeply-nested']]);
      expect(result).toContain('base-class');
      expect(result).toContain('nested1');
      expect(result).toContain('nested2');
      expect(result).toContain('deeply-nested');
    });
  });
});
