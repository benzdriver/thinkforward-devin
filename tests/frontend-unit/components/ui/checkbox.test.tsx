import React from 'react';
import { render, screen } from '../../test-utils';
import '@testing-library/jest-dom';
import { Checkbox } from '@/components/ui/checkbox';

describe('Checkbox 组件', () => {
  it('渲染基本复选框', () => {
    render(<Checkbox />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('应用不同的变体样式', () => {
    const { rerender } = render(<Checkbox variant="default" />);
    expect(screen.getByRole('checkbox')).toHaveClass('border-secondary-300');
    expect(screen.getByRole('checkbox')).toHaveClass('text-primary');

    rerender(<Checkbox variant="error" />);
    expect(screen.getByRole('checkbox')).toHaveClass('border-destructive-300');
    expect(screen.getByRole('checkbox')).toHaveClass('text-destructive');

    rerender(<Checkbox variant="success" />);
    expect(screen.getByRole('checkbox')).toHaveClass('border-success-300');
    expect(screen.getByRole('checkbox')).toHaveClass('text-success');
  });

  it('应用不同的尺寸样式', () => {
    const { rerender } = render(<Checkbox size="sm" />);
    expect(screen.getByRole('checkbox')).toHaveClass('h-3');
    expect(screen.getByRole('checkbox')).toHaveClass('w-3');

    rerender(<Checkbox size="md" />);
    expect(screen.getByRole('checkbox')).toHaveClass('h-4');
    expect(screen.getByRole('checkbox')).toHaveClass('w-4');

    rerender(<Checkbox size="lg" />);
    expect(screen.getByRole('checkbox')).toHaveClass('h-5');
    expect(screen.getByRole('checkbox')).toHaveClass('w-5');
  });

  it('渲染标签文本', () => {
    render(<Checkbox label="接受条款" />);
    expect(screen.getByText('接受条款')).toBeInTheDocument();
    expect(screen.getByText('接受条款')).toHaveClass('font-medium');
  });

  it('渲染描述文本', () => {
    render(<Checkbox description="请阅读并接受我们的条款和条件" />);
    expect(screen.getByText('请阅读并接受我们的条款和条件')).toBeInTheDocument();
    expect(screen.getByText('请阅读并接受我们的条款和条件')).toHaveClass('text-neutral-600');
  });

  it('渲染错误信息', () => {
    render(<Checkbox error="您必须接受条款才能继续" />);
    expect(screen.getByText('您必须接受条款才能继续')).toBeInTheDocument();
    expect(screen.getByText('您必须接受条款才能继续')).toHaveClass('text-destructive');
  });

  it('当有错误时自动应用错误变体', () => {
    render(<Checkbox error="错误信息" />);
    expect(screen.getByRole('checkbox')).toHaveClass('border-destructive-300');
    expect(screen.getByRole('checkbox')).toHaveClass('text-destructive');
  });

  it('接受并应用自定义类名', () => {
    render(<Checkbox className="custom-class" />);
    expect(screen.getByRole('checkbox')).toHaveClass('custom-class');
  });

  it('同时渲染标签和描述', () => {
    render(
      <Checkbox 
        label="接受条款" 
        description="请阅读并接受我们的条款和条件"
      />
    );
    
    expect(screen.getByText('接受条款')).toBeInTheDocument();
    expect(screen.getByText('请阅读并接受我们的条款和条件')).toBeInTheDocument();
  });
});
