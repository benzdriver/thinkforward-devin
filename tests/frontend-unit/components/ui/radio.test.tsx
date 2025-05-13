import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Radio } from '@/components/ui/radio';

describe('Radio 组件', () => {
  it('渲染基本单选框', () => {
    render(<Radio />);
    expect(screen.getByRole('radio')).toBeInTheDocument();
  });

  it('应用不同的变体样式', () => {
    const { rerender } = render(<Radio variant="default" />);
    expect(screen.getByRole('radio')).toHaveClass('border-secondary-300');
    expect(screen.getByRole('radio')).toHaveClass('text-primary');

    rerender(<Radio variant="error" />);
    expect(screen.getByRole('radio')).toHaveClass('border-destructive-300');
    expect(screen.getByRole('radio')).toHaveClass('text-destructive');

    rerender(<Radio variant="success" />);
    expect(screen.getByRole('radio')).toHaveClass('border-success-300');
    expect(screen.getByRole('radio')).toHaveClass('text-success');

    rerender(<Radio variant="warning" />);
    expect(screen.getByRole('radio')).toHaveClass('border-warning-300');
    expect(screen.getByRole('radio')).toHaveClass('text-warning');
  });

  it('应用不同的尺寸样式', () => {
    const { rerender } = render(<Radio size="sm" />);
    expect(screen.getByRole('radio')).toHaveClass('h-3');
    expect(screen.getByRole('radio')).toHaveClass('w-3');

    rerender(<Radio size="md" />);
    expect(screen.getByRole('radio')).toHaveClass('h-4');
    expect(screen.getByRole('radio')).toHaveClass('w-4');

    rerender(<Radio size="lg" />);
    expect(screen.getByRole('radio')).toHaveClass('h-5');
    expect(screen.getByRole('radio')).toHaveClass('w-5');
  });

  it('渲染标签文本', () => {
    render(<Radio label="选择选项" />);
    expect(screen.getByText('选择选项')).toBeInTheDocument();
    expect(screen.getByText('选择选项')).toHaveClass('font-medium');
  });

  it('渲染描述文本', () => {
    render(<Radio description="这是一个选项的详细描述" />);
    expect(screen.getByText('这是一个选项的详细描述')).toBeInTheDocument();
    expect(screen.getByText('这是一个选项的详细描述')).toHaveClass('text-neutral-600');
  });

  it('渲染错误信息', () => {
    render(<Radio error="请选择一个选项" />);
    expect(screen.getByText('请选择一个选项')).toBeInTheDocument();
    expect(screen.getByText('请选择一个选项')).toHaveClass('text-destructive');
  });

  it('当有错误时自动应用错误变体', () => {
    render(<Radio error="错误信息" />);
    expect(screen.getByRole('radio')).toHaveClass('border-destructive-300');
    expect(screen.getByRole('radio')).toHaveClass('text-destructive');
  });

  it('接受并应用自定义类名', () => {
    render(<Radio className="custom-class" />);
    expect(screen.getByRole('radio')).toHaveClass('custom-class');
  });

  it('接受并应用容器自定义类名', () => {
    const { container } = render(<Radio containerClassName="container-custom-class" />);
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).toHaveClass('container-custom-class');
    expect(outerDiv).toHaveClass('space-y-2');
  });

  it('接受并应用标签自定义类名', () => {
    render(<Radio label="标签" labelClassName="label-custom-class" />);
    expect(screen.getByText('标签')).toHaveClass('label-custom-class');
  });

  it('接受并应用描述自定义类名', () => {
    render(<Radio description="描述" descriptionClassName="description-custom-class" />);
    expect(screen.getByText('描述')).toHaveClass('description-custom-class');
  });

  it('同时渲染标签和描述', () => {
    render(
      <Radio 
        label="选项标签" 
        description="选项描述"
      />
    );
    
    expect(screen.getByText('选项标签')).toBeInTheDocument();
    expect(screen.getByText('选项描述')).toBeInTheDocument();
  });
});
