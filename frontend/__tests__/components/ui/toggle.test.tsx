import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Toggle } from '../../../components/ui/toggle';

describe('Toggle 组件', () => {
  it('渲染基本开关', () => {
    render(<Toggle />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('应用不同的变体样式', () => {
    const { rerender } = render(<Toggle variant="default" />);
    expect(screen.getByRole('switch')).toHaveClass('data-[state=checked]:bg-primary');

    rerender(<Toggle variant="success" />);
    expect(screen.getByRole('switch')).toHaveClass('data-[state=checked]:bg-success');

    rerender(<Toggle variant="warning" />);
    expect(screen.getByRole('switch')).toHaveClass('data-[state=checked]:bg-warning');

    rerender(<Toggle variant="destructive" />);
    expect(screen.getByRole('switch')).toHaveClass('data-[state=checked]:bg-destructive');
  });

  it('应用不同的尺寸样式', () => {
    const { rerender } = render(<Toggle size="sm" />);
    expect(screen.getByRole('switch')).toHaveClass('h-4');
    expect(screen.getByRole('switch')).toHaveClass('w-8');

    rerender(<Toggle size="md" />);
    expect(screen.getByRole('switch')).toHaveClass('h-6');
    expect(screen.getByRole('switch')).toHaveClass('w-11');

    rerender(<Toggle size="lg" />);
    expect(screen.getByRole('switch')).toHaveClass('h-7');
    expect(screen.getByRole('switch')).toHaveClass('w-14');
  });

  it('渲染标签文本', () => {
    render(<Toggle label="开关标签" />);
    expect(screen.getByText('开关标签')).toBeInTheDocument();
    expect(screen.getByText('开关标签')).toHaveClass('font-medium');
  });

  it('渲染描述文本', () => {
    render(<Toggle description="开关描述" />);
    expect(screen.getByText('开关描述')).toBeInTheDocument();
    expect(screen.getByText('开关描述')).toHaveClass('text-neutral-600');
  });

  it('渲染错误信息', () => {
    render(<Toggle error="错误信息" />);
    expect(screen.getByText('错误信息')).toBeInTheDocument();
    expect(screen.getByText('错误信息')).toHaveClass('text-destructive');
  });

  it('接受并应用自定义类名', () => {
    render(<Toggle className="custom-class" />);
    expect(screen.getByRole('switch')).toHaveClass('custom-class');
  });

  it('接受并应用容器自定义类名', () => {
    const { container } = render(<Toggle containerClassName="container-custom-class" />);
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv).toHaveClass('container-custom-class');
    expect(outerDiv).toHaveClass('space-y-2');
  });

  it('接受并应用标签自定义类名', () => {
    render(<Toggle label="标签" labelClassName="label-custom-class" />);
    expect(screen.getByText('标签')).toHaveClass('label-custom-class');
  });

  it('接受并应用描述自定义类名', () => {
    render(<Toggle description="描述" descriptionClassName="description-custom-class" />);
    expect(screen.getByText('描述')).toHaveClass('description-custom-class');
  });

  it('点击时切换状态', () => {
    const handleChange = jest.fn();
    render(<Toggle onCheckedChange={handleChange} />);
    
    const toggleButton = screen.getByRole('switch');
    expect(toggleButton).toHaveAttribute('aria-checked', 'false');
    expect(toggleButton).toHaveAttribute('data-state', 'unchecked');
    
    fireEvent.click(toggleButton);
    
    expect(toggleButton).toHaveAttribute('aria-checked', 'true');
    expect(toggleButton).toHaveAttribute('data-state', 'checked');
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('使用受控模式', () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <Toggle checked={false} onCheckedChange={handleChange} />
    );
    
    const toggleButton = screen.getByRole('switch');
    expect(toggleButton).toHaveAttribute('aria-checked', 'false');
    
    fireEvent.click(toggleButton);
    expect(handleChange).toHaveBeenCalledWith(true);
    
    expect(toggleButton).toHaveAttribute('aria-checked', 'false');
    
    rerender(<Toggle checked={true} onCheckedChange={handleChange} />);
    expect(toggleButton).toHaveAttribute('aria-checked', 'true');
  });

  it('使用非受控模式（defaultChecked）', () => {
    render(<Toggle defaultChecked={true} />);
    
    const toggleButton = screen.getByRole('switch');
    expect(toggleButton).toHaveAttribute('aria-checked', 'true');
    
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveAttribute('aria-checked', 'false');
  });

  it('同时渲染标签和描述', () => {
    render(
      <Toggle 
        label="开关标签" 
        description="开关描述"
      />
    );
    
    expect(screen.getByText('开关标签')).toBeInTheDocument();
    expect(screen.getByText('开关描述')).toBeInTheDocument();
  });
});
