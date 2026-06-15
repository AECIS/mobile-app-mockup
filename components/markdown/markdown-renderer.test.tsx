import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MarkdownRenderer } from './markdown-renderer';

const html = (source: string) => renderToStaticMarkup(<MarkdownRenderer source={source} />);

describe('MarkdownRenderer', () => {
  it('renders bold', () => {
    expect(html('**x**')).toContain('<strong>x</strong>');
  });

  it('renders italic', () => {
    expect(html('_x_')).toContain('<em>x</em>');
  });

  it('renders a bullet list', () => {
    const out = html('- a\n- b');
    expect(out).toContain('<ul');
    expect(out).toContain('<li>a</li>');
    expect(out).toContain('<li>b</li>');
  });

  it('renders an ordered list', () => {
    const out = html('1. a\n2. b');
    expect(out).toContain('<ol');
    expect(out).toContain('<li>a</li>');
  });

  it('escapes raw HTML (no injection)', () => {
    const out = html('<img src=x onerror=alert(1)>');
    expect(out).not.toContain('<img');
    expect(out).toContain('&lt;img');
  });

  it('renders a single paragraph inline (no nested <p>) for clamp support', () => {
    expect(html('hello world')).not.toContain('<p>');
  });

  it('keeps the leading reply prefix inline', () => {
    const out = renderToStaticMarkup(
      <MarkdownRenderer source="hi" leading={<span>Jane </span>} />,
    );
    expect(out).toContain('<span>Jane </span>hi');
  });
});
