+++
title = 'Before building a dashboard, name the decision'
date = '2026-10-29T12:00:00+08:00'
draft = true
translationKey = 'decision-before-dashboard'
tags = ['Analytics', 'Decision support']
description = 'An illustrative example of connecting a business question to analysis, a small software tool, and a way to evaluate whether it helps.'
tldr = 'Start with who needs to decide what. Use analysis to reduce uncertainty, build the smallest useful intervention, and check what changes in practice.'
+++

> **An illustrative example.** The scenario below is hypothetical. It describes an approach to a problem, not a completed client engagement or a claim of measured results.

“We need a dashboard” sounds like a clear request. It names something we can build.

But it leaves a more important question unanswered: **what should someone do differently after looking at it?**

This is where I like to connect my two pillars: analysis that supports a judgment, and engineering that makes the next action easier.

## Start with the decision

Imagine a small distributor whose operations manager asks for a weekly sales dashboard. The team wants revenue, order volume, and growth by customer.

Before choosing charts, I would ask:

- What decision is difficult to make today?
- Who makes it, and when?
- What information could change their choice?
- What would happen if we did nothing?

Suppose the conversation reveals that the real concern is missed repeat orders. Account managers want to know which customers might need a follow-up this week.

Now there is a decision to support: **which accounts deserve attention, and why?**

## Use analysis to challenge the explanation

A decline in orders does not automatically mean a customer is leaving. It might reflect seasonality, a stockout, a large previous purchase, or an incomplete data feed.

I would begin by checking order history, customer identifiers, and data freshness. Then I would compare each customer's recent activity with their own purchasing pattern, rather than applying one threshold to everyone.

The analysis should produce a shortlist with reasons and uncertainties. A conversation with an account manager could reveal that a seemingly inactive customer is simply following a normal buying cycle.

**The purpose is to improve judgment, not turn a noisy signal into a confident label.**

## Build the smallest useful intervention

The first version might be a weekly review list rather than a dashboard:

- The account and the reason it was flagged.
- Relevant order history and when the data was last updated.
- A place to record whether follow-up is appropriate.
- An owner and a next step.

A small script and a shared sheet could be enough to test the workflow. A custom application would make sense only if permissions, coordination, or repeated use justified it.

The tool earns its place by fitting the team's work. If nobody owns the review, a more polished interface will not solve that problem.

## Decide how to learn from use

Before a pilot, I would agree on what to observe:

1. **Use:** Does the team review the list and record decisions?
2. **Decision quality:** Are the flags relevant, or do they create unnecessary work?
3. **Operational change:** Does the process help the team identify and follow up on accounts sooner?
4. **Business effect:** Is there evidence of better customer retention or recovered orders?

These are different levels of evidence. A follow-up followed by an order does not, on its own, prove that the tool caused the order. A pilot can reveal usefulness and failure modes before it can establish a commercial effect.

## Judgment and building, together

Analysis helps decide what deserves attention. Engineering makes that judgment usable in a real workflow. Feedback from use then gives the analysis something new to explain.

That is the kind of loop I want to practise: **understand the problem, build what helps, and stay curious about whether it actually does.**
