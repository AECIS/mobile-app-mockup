import { describe, it, expect } from 'vitest';
import { applyMarkdown } from './markdown-format';

describe('applyMarkdown', () => {
  it('wraps bold and keeps selection over the text', () => {
    expect(applyMarkdown('bold', 'ab', 0, 2)).toEqual({ value: '**ab**', start: 2, end: 4 });
  });

  it('unwraps bold when markers sit outside the selection', () => {
    expect(applyMarkdown('bold', '**ab**', 2, 4)).toEqual({ value: 'ab', start: 0, end: 2 });
  });

  it('unwraps bold when markers are inside the selection', () => {
    expect(applyMarkdown('bold', '**ab**', 0, 6)).toEqual({ value: 'ab', start: 0, end: 2 });
  });

  it('inserts empty bold with caret centered', () => {
    expect(applyMarkdown('bold', '', 0, 0)).toEqual({ value: '****', start: 2, end: 2 });
  });

  it('wraps italic with underscore', () => {
    expect(applyMarkdown('italic', 'x', 0, 1)).toEqual({ value: '_x_', start: 1, end: 2 });
  });

  it('adds bullet prefixes across lines', () => {
    expect(applyMarkdown('bullet', 'a\nb', 0, 3).value).toBe('- a\n- b');
  });

  it('toggles bullet prefixes off', () => {
    expect(applyMarkdown('bullet', '- a\n- b', 0, 7).value).toBe('a\nb');
  });

  it('adds incremented ordered prefixes', () => {
    expect(applyMarkdown('ordered', 'a\nb', 0, 3).value).toBe('1. a\n2. b');
  });

  it('toggles ordered prefixes off', () => {
    expect(applyMarkdown('ordered', '1. a\n2. b', 0, 9).value).toBe('a\nb');
  });
});
