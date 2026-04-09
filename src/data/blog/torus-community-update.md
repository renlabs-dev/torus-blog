---
title: Torus Community Update
author: Renlabs
pubDatetime: 2026-04-09T20:55:03Z
featured: false
draft: false
tags:
  - Torus
  - Security
  - Incident Report
  - Infrastructure
  - Token Migration
description: Initial community update on the April 1 unauthorized mint, current findings from the investigation, and the recovery path ahead.
---

On April 1st, an unauthorized mint occurred on Torus in a single block.

This was not a normal user transaction, not a governance action, and not a standard runtime upgrade path. Part of the minted supply was moved quickly and sold. Since then, we've been tracing the fund flow, auditing chain behavior, and reconstructing the infrastructure timeline around it.

We are keeping some operational details private while the investigation is still active. At the same time, we don't want to delay sharing what we can confirm.

We also want to acknowledge the delay in communication. We prioritized securing access, rotating keys, and stabilizing the system before publishing, to ensure that what we share is accurate and does not introduce further risk.

## TLDR

- an unauthorized mint occurred in a single block
- the strongest current explanation is compromised infrastructure access
- our current best assessment is that the attack most likely began with an infrastructure operator being compromised, along with his SSH keys and related access, after installing a package on his device
- immediate actions focused on securing the system and removing any remaining access
- we are redesigning the infrastructure from the ground up to remove any single point of failure
- we are preparing a token migration and liquidity restoration

## What happened

In one block, a large amount of TORUS was minted to a set of fresh addresses. Some of those funds were then moved out and sold in a coordinated way.

## What we know so far

The onchain runtime hash remained the same before, during, and after the incident.

When we replay the same chain state on the normal runtime, we do not reproduce the mint.

At the same time, our validator nodes were taken offline in a coordinated way, supporting API nodes were wiped and restarted, and parts of the infrastructure logs were cleared.

Our current best assessment is that this most likely began with one of our infrastructure operators being compromised, along with his SSH keys and related access, after installing a package on his device. This is the theory that best matches the timeline and access patterns we have reconstructed so far.

## What we have done

- traced the unauthorized mint and a large portion of the funds that moved afterward
- audited validator, API, archive, cloud, and CI activity around the incident
- mapped the infrastructure actions that occurred around the same time as the mint
- rotated validator keys and access credentials across the system
- hardened infrastructure and removed any confirmed attacker access
- started redesigning the infrastructure

## What's next

We are rebuilding the infrastructure so one person, one machine, or one key compromise cannot become a system-wide failure.

That means removing single points of failure and tightening control over access and changes.

In parallel, we are preparing a bridge with a new provider and a token migration that excludes funds controlled by the attacker. We expect an initial timeline of around two weeks, alongside a plan to restore liquidity.

We will publish a more extensive report covering the incident and all changes made once it is safe to do so.

- Renlabs
