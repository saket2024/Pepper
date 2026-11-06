"use client";

import React from "react";

export function GrainBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background radial ambient gradients */}
      <div className="absolute -top-[20%] left-[15%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[150px]" />
      <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] rounded-full bg-zinc-700/15 blur-[160px]" />
      <div className="absolute -bottom-[20%] left-[30%] w-[700px] h-[700px] rounded-full bg-emerald-500/5 blur-[180px]" />

      {/* SVG Grain noise texture */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
