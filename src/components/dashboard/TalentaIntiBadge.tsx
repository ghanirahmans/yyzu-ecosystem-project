// ============================================================
// TalentaIntiBadge — display for Talenta Inti members
// Shows their elevated status with rights info.
// ============================================================

import { Star, Vote, Award } from "lucide-react";

export function TalentaIntiBadge() {
  return (
    <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-5 mb-6 animate-slide-in-up">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <Star size={20} className="text-cyan-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-cyan-400 mb-1">
            Talenta Inti
          </h3>
          <p className="text-xs text-white/40 leading-relaxed mb-3">
            Anda adalah anggota tetap YYZU dengan hak suara penuh dalam Rapat
            Anggota. Status ini diberikan berdasarkan kontribusi dan komitmen
            jangka panjang Anda.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/10">
              <Vote size={12} /> Hak Suara Penuh
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/10">
              <Award size={12} /> Anggota Tetap
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}