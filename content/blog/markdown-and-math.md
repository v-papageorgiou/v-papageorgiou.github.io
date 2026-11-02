---
title: "Writing with Markdown and math"
description: "A draft example of the blog's typography, equations, code, and references."
date: "2026-11-02"
draft: true
tags: [Markdown, Math]
---

This is a writing sample. It stays in your local preview while `draft: true`, so you can experiment with the layout before publishing your first post.

## A little math, in context

Inline math fits naturally into a sentence: let $x \in \mathbb{R}^d$ and define the squared norm as $\lVert x \rVert_2^2 = \sum_{i=1}^d x_i^2$.

For an equation that needs more room, use a display block:

$$
\mathcal{L}(\theta)
= -\frac{1}{N}\sum_{i=1}^{N}
\log p_{\theta}(y_i \mid x_i).
$$

The equations are typeset when the page is built. Readers see the result immediately, alongside the text.

## More than one line

Use `aligned` for a short derivation:

$$
\begin{aligned}
\nabla_{\theta}\mathcal{L}(\theta)
&= -\frac{1}{N}\sum_{i=1}^{N}
\nabla_{\theta}\log p_{\theta}(y_i \mid x_i), \\
\theta_{t+1}
&= \theta_t - \eta\,\nabla_{\theta}\mathcal{L}(\theta_t).
\end{aligned}
$$

Matrices work too:

$$
A = \begin{bmatrix} 1 & 2 \\ 3 & 4 \end{bmatrix},
\qquad \det(A) = -2.
$$

## Figures

A figure can sit alongside the explanation, with a caption underneath. Figures are part of the article and are not clickable.

![A three-stage diagram showing input flowing through reasoning to an answer.](/blog/figure-example.svg "Figure 1. A simple reasoning pipeline. This is an example diagram for the writing template.")

PDF and PNG figures use the same Markdown syntax. Here is the same diagram in each format:

![Input flows through reasoning to an answer, rendered from a PDF.](/blog/figure-example.pdf "Figure 2. A PDF figure rendered directly in the article.")

![Input flows through reasoning to an answer, rendered from a PNG.](/blog/figure-example.png "Figure 3. A PNG version of the same diagram.")

## Code and ordinary Markdown

Fenced code blocks use JetBrains Mono. Math inside a code block stays literal:

```python
for step in range(num_steps):
    loss = objective(theta)
    theta = theta - learning_rate * gradient(loss)
```

You can use **bold**, *italics*, [links](https://katex.org/docs/supported.html), lists, tables, and footnotes.[^math]

- Keep a clear question at the center of the post.
- Introduce symbols before using them.
- Give equations enough room to breathe.

> An equation is part of the explanation. The surrounding words should say what it means and why it matters.

| Notation | Meaning |
| --- | --- |
| $N$ | Number of examples |
| $\theta$ | Model parameters |
| $\eta$ | Learning rate |

[^math]: This blog uses KaTeX for LaTeX-style mathematical notation. It does not compile full LaTeX documents.
