import React from 'react';
import { render, screen } from '../../test-utils';
import '@testing-library/jest-dom';
import { Input } from '@/components/ui/input';

describe('Input 组件', () => {
  it('渲染基本输入框', () => {
    render(<Input placeholder="请输入" />);
    expect(screen.getByPlaceholderText('请输入')).toBeInTheDocument();
  });

  it('应用不同的变体样式', () => {
    const { rerender } = render(<Input variant="default" placeholder="默认输入框" />);
    expect(screen.getByPlaceholderText('默认输入框')).toHaveClass('border-secondary-200');
    expect(screen.getByPlaceholderText('默认输入框')).toHaveClass('focus:ring-primary-400');

    rerender(<Input variant="error" placeholder="错误输入框" />);
    expect(screen.getByPlaceholderText('错误输入框')).toHaveClass('border-destructive');
    expect(screen.getByPlaceholderText('错误输入框')).toHaveClass('focus:ring-destructive-300');

    rerender(<Input variant="success" placeholder="成功输入框" />);
    expect(screen.getByPlaceholderText('成功输入框')).toHaveClass('border-success-300');
    expect(screen.getByPlaceholderText('成功输入框')).toHaveClass('focus:ring-success-400');
  });

  it('应用不同的尺寸样式', () => {
    const { rerender } = render(<Input size="sm" placeholder="小输入框" />);
    expect(screen.getByPlaceholderText('小输入框')).toHaveClass('h-8');
    expect(screen.getByPlaceholderText('小输入框')).toHaveClass('px-2');
    expect(screen.getByPlaceholderText('小输入框')).toHaveClass('text-xs');

    rerender(<Input size="md" placeholder="中输入框" />);
    expect(screen.getByPlaceholderText('中输入框')).toHaveClass('h-10');
    expect(screen.getByPlaceholderText('中输入框')).toHaveClass('px-3');
    expect(screen.getByPlaceholderText('中输入框')).toHaveClass('py-2');

    rerender(<Input size="lg" placeholder="大输入框" />);
    expect(screen.getByPlaceholderText('大输入框')).toHaveClass('h-12');
    expect(screen.getByPlaceholderText('大输入框')).toHaveClass('px-4');
    expect(screen.getByPlaceholderText('大输入框')).toHaveClass('py-3');
    expect(screen.getByPlaceholderText('大输入框')).toHaveClass('text-base');
  });

  it('渲染标签文本', () => {
    render(<Input label="用户名" placeholder="请输入用户名" />);
    expect(screen.getByText('用户名')).toBeInTheDocument();
    expect(screen.getByText('用户名')).toHaveClass('text-sm');
    expect(screen.getByText('用户名')).toHaveClass('font-medium');
  });

  it('渲染错误信息', () => {
    render(<Input error="用户名不能为空" placeholder="请输入用户名" />);
    expect(screen.getByText('用户名不能为空')).toBeInTheDocument();
    expect(screen.getByText('用户名不能为空')).toHaveClass('text-destructive');
  });

  it('渲染帮助文本', () => {
    render(<Input helperText="请输入您的用户名" placeholder="请输入用户名" />);
    expect(screen.getByText('请输入您的用户名')).toBeInTheDocument();
    expect(screen.getByText('请输入您的用户名')).toHaveClass('text-neutral-500');
  });

  it('当有错误时不显示帮助文本', () => {
    render(
      <Input 
        error="用户名不能为空" 
        helperText="请输入您的用户名" 
        placeholder="请输入用户名" 
      />
    );
    expect(screen.getByText('用户名不能为空')).toBeInTheDocument();
    expect(screen.queryByText('请输入您的用户名')).not.toBeInTheDocument();
  });

  it('接受并应用自定义类名', () => {
    render(<Input className="custom-class" placeholder="自定义类名输入框" />);
    expect(screen.getByPlaceholderText('自定义类名输入框')).toHaveClass('custom-class');
  });

  it('当有错误时自动应用错误变体', () => {
    render(<Input error="错误信息" placeholder="错误输入框" />);
    expect(screen.getByPlaceholderText('错误输入框')).toHaveClass('border-destructive');
    expect(screen.getByPlaceholderText('错误输入框')).toHaveClass('focus:ring-destructive-300');
  });
});
