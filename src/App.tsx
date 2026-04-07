import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://aoifhrkzdgnhnnbtjxri.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvaWZocmt6ZGduaG5uYnRqeHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNzU3OTMsImV4cCI6MjA5MDY1MTc5M30.6U2kHdN_s88M6fmVqceNMpB0A30Wc0tM00vH6MqDC2w"
);

type DbMatch = {
  id: string;
  match_no: number;
  bracket: string;
  source_top: string | null;
  source_bottom: string | null;
  player_top_name: string | null;
  player_bottom_name: string | null;
  sets_top: number | null;
  sets_bottom: number | null;
  x_pos: number | string;
  y_pos: number | string;
  best_of: number | null;
};

type DbPlayer = {
  id: string;
  seed_no: number;
  display_name: string;
  is_active: boolean;
};

type DbTournament = {
  id: string;
  title: string;
  homepage_news: string | null;
  show_homepage_news: boolean | null;
  play_until_text: string | null;
  finals_text: string | null;
};

type Template = {
  box: { x: number; y: number };
  name1: { x: number; y: number };
  name2: { x: number; y: number };
  score1: { x: number; y: number };
  score2: { x: number; y: number };
};

type MatchData = {
  id: string;
  matchNo: number;
  p1: string;
  p2: string;
  s1: number;
  s2: number;
  originX: number;
  originY: number;
  bestOf: number;
};

const palette = {
  page: "#2CA5FD",
  board: "#39ADFF",
  winner: "#dcedfb",
  bestOf5: "#f6d7a8",
  border: "#8d6d1f",
  text: "#1f2a37",
  blue: "#3b74b6",
  middleBand: "#1EA3FF",
  line: "#7b6320",
};

const TOURNAMENT_ID = "422a142f-2bf0-44c8-817d-7cf5f769a2a5";

const boardW = 1700;
const boardH = 1500;
const boxW = 82;
const boxH = 28;
const nameFontSize = 12;
const listFontSize = 14;
const dividerLeftX = 473;
const dividerRightX = 1088;

const frozenTemplate: Template = {
  box: { x: 160, y: 150 },
  name1: { x: 170, y: 107 },
  name2: { x: 172, y: 155 },
  score1: { x: 224, y: 123 },
  score2: { x: 224, y: 137 },
};

function normalizeMatch(row: DbMatch): MatchData {
  return {
    id: String(row.match_no),
    matchNo: row.match_no,
    p1: row.player_top_name || row.source_top || "",
    p2: row.player_bottom_name || row.source_bottom || "",
    s1: Number(row.sets_top ?? 0),
    s2: Number(row.sets_bottom ?? 0),
    originX: Number(row.x_pos),
    originY: Number(row.y_pos),
    bestOf: Number(row.best_of ?? 3),
  };
}

function withOffsets(template: Template, commonOffset: number, topNameOffset: number, bottomNameOffset: number): Template {
  return {
    ...template,
    name1: { ...template.name1, y: template.name1.y + commonOffset + topNameOffset },
    name2: { ...template.name2, y: template.name2.y + commonOffset + bottomNameOffset },
    score1: { ...template.score1, y: template.score1.y + commonOffset },
    score2: { ...template.score2, y: template.score2.y + commonOffset },
  };
}

function yMid(match: MatchData) {
  return match.originY + boxH / 2;
}
function xRight(match: MatchData) {
  return match.originX + boxW;
}
function xLeft(match: MatchData) {
  return match.originX;
}
function targetOriginRight(match: MatchData) {
  return match.originX + boxW;
}

function groupConnectors(from: MatchData[], to: MatchData[], direction: "right" | "left", drawVertical: boolean = true) {
  const lines: React.ReactNode[] = [];
  const cap = Math.min(Math.floor(from.length / 2), to.length);

  for (let i = 0; i < cap; i++) {
    const a = from[i * 2];
    const b = from[i * 2 + 1];
    const target = to[i];
    if (!a || !b || !target) continue;

    const ay = yMid(a);
    const by = yMid(b);
    const ty = yMid(target);

    if (direction === "right") {
      const joinX = target.originX - 16;
      lines.push(<line key={`ha-${a.id}-${target.id}`} x1={xRight(a)} y1={ay} x2={joinX} y2={ay} />);
      lines.push(<line key={`hb-${b.id}-${target.id}`} x1={xRight(b)} y1={by} x2={joinX} y2={by} />);
      if (drawVertical) lines.push(<line key={`va-${target.id}`} x1={joinX} y1={ay} x2={joinX} y2={by} />);
      lines.push(<line key={`ta-${target.id}`} x1={joinX} y1={ty} x2={target.originX} y2={ty} />);
    } else {
      const joinX = target.originX + boxW + 16;
      lines.push(<line key={`ha-${a.id}-${target.id}`} x1={xLeft(a)} y1={ay} x2={joinX} y2={ay} />);
      lines.push(<line key={`hb-${b.id}-${target.id}`} x1={xLeft(b)} y1={by} x2={joinX} y2={by} />);
      if (drawVertical) lines.push(<line key={`va-${target.id}`} x1={joinX} y1={ay} x2={joinX} y2={by} />);
      lines.push(<line key={`ta-${target.id}`} x1={targetOriginRight(target)} y1={ty} x2={joinX} y2={ty} />);
    }
  }

  return lines;
}

function customConnector(from: MatchData, to: MatchData, direction: "right" | "left", keyBase: string) {
  const fy = yMid(from);
  const ty = yMid(to);

  if (direction === "right") {
    const joinX = to.originX - 16;
    return [
      <line key={`${keyBase}-1`} x1={xRight(from)} y1={fy} x2={joinX} y2={fy} />,
      <line key={`${keyBase}-2`} x1={joinX} y1={fy} x2={joinX} y2={ty} />,
      <line key={`${keyBase}-3`} x1={joinX} y1={ty} x2={to.originX} y2={ty} />,
    ];
  }

  const joinX = to.originX + boxW + 16;
  return [
    <line key={`${keyBase}-1`} x1={xLeft(from)} y1={fy} x2={joinX} y2={fy} />,
    <line key={`${keyBase}-2`} x1={joinX} y1={fy} x2={joinX} y2={ty} />,
    <line key={`${keyBase}-3`} x1={targetOriginRight(to)} y1={ty} x2={joinX} y2={ty} />,
  ];
}

const abs = (left: number, top: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  position: "absolute",
  left,
  top,
  ...extra,
});

function MatchBox({ match, template }: { match: MatchData; template: Template }) {
  const name1Top = match.originY + (template.name1.y - frozenTemplate.box.y);
  const name2Top = match.originY + (template.name2.y - frozenTemplate.box.y);
  const scoreColumnX = match.originX + (template.score1.x - frozenTemplate.box.x);
  const score1Top = match.originY + (template.score1.y - frozenTemplate.box.y);
  const score2Top = match.originY + (template.score2.y - frozenTemplate.box.y);
  const scoreMidY = Math.round(match.originY + boxH / 2);
  const scoreWidth = boxW - (scoreColumnX - match.originX);
  const fillColor = match.bestOf === 5 ? palette.bestOf5 : palette.winner;

  return (
    <>
      <div
        style={abs(match.originX, match.originY, {
          width: boxW,
          height: boxH,
          background: fillColor,
          border: `1px solid ${palette.border}`,
          borderRadius: 7,
          boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
          boxSizing: "border-box",
        })}
      />
      <div
        style={abs(match.originX, match.originY, {
          width: boxW,
          height: boxH,
          color: palette.text,
          fontSize: 18,
          fontWeight: 700,
          lineHeight: `${boxH}px`,
          textAlign: "center",
        })}
      >
        {match.id}
      </div>
      <div
        style={abs(match.originX, name1Top, {
          width: boxW,
          color: palette.text,
          fontSize: nameFontSize,
          textAlign: "center",
          lineHeight: 1,
        })}
      >
        {match.p1}
      </div>
      <div
        style={abs(match.originX, name2Top, {
          width: boxW,
          color: palette.text,
          fontSize: nameFontSize,
          textAlign: "center",
          lineHeight: 1,
        })}
      >
        {match.p2}
      </div>
      <div style={abs(scoreColumnX, match.originY, { width: 1, height: boxH, background: palette.border })} />
      <div style={abs(scoreColumnX, scoreMidY, { width: scoreWidth, height: 1, background: palette.border })} />
      <div
        style={abs(scoreColumnX, score1Top, {
          width: scoreWidth,
          height: 10,
          color: palette.text,
          fontSize: 11,
          fontWeight: 600,
          lineHeight: "10px",
          textAlign: "center",
        })}
      >
        {match.s1}
      </div>
      <div
        style={abs(scoreColumnX, score2Top, {
          width: scoreWidth,
          height: 10,
          color: palette.text,
          fontSize: 11,
          fontWeight: 600,
          lineHeight: "10px",
          textAlign: "center",
        })}
      >
        {match.s2}
      </div>
    </>
  );
}

function Meldeliste({ players }: { players: DbPlayer[] }) {
  return (
    <>
      <div style={abs(780, 64, { color: palette.text, fontSize: 16, fontWeight: 700 })}>Meldeliste</div>
      <div style={abs(765, 110, { width: 120 })}>
        {players.map((player) => {
          const top = 14 + (player.seed_no - 1) * 29 - 23;
          return (
            <div key={player.id} style={abs(0, top, { right: 0, color: palette.text, fontSize: listFontSize, lineHeight: 1 })}>
              <div style={abs(0, 14, { right: 0, height: 1, background: palette.border, opacity: 0.8 })} />
              <span style={{ display: "inline-block", width: 20, textAlign: "right" }}>{player.seed_no}</span>
              <span style={{ marginLeft: 8 }}>{player.display_name}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

function BestOfLegend() {
  return (
    <div
      style={abs(1455, 905, {
        width: 175,
        padding: 12,
        background: "rgba(57, 173, 255, 0.55)",
        border: `1px solid ${palette.border}`,
        borderRadius: 12,
        boxSizing: "border-box",
      })}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div
          style={{
            width: 34,
            height: 20,
            background: palette.winner,
            border: `1px solid ${palette.border}`,
            borderRadius: 6,
          }}
        />
        <div style={{ fontSize: 12, color: palette.text }}>Best of 3</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 20,
            background: palette.bestOf5,
            border: `1px solid ${palette.border}`,
            borderRadius: 6,
          }}
        />
        <div style={{ fontSize: 12, color: palette.text }}>Best of 5</div>
      </div>
    </div>
  );
}

function NewsPanel({ text, visible }: { text: string; visible: boolean }) {
  if (!visible || !text.trim()) return null;

  return (
    <div
      style={abs(1450, 80, {
        width: 185,
        minHeight: 160,
        padding: 12,
        background: "rgba(57, 173, 255, 0.55)",
        border: `1px solid ${palette.border}`,
        borderRadius: 12,
        boxSizing: "border-box",
      })}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: palette.text, marginBottom: 10 }}>Aktuelle Nachrichten</div>
      <div
        style={{
          fontSize: 12,
          color: palette.text,
          lineHeight: 1.35,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {text}
      </div>
    </div>
  );
}

function TrophyPanel() {
  return (
    <div
      style={abs(1385, 235, {
        width: 250,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      })}
    >
      <img
        src="/trophy.png"
        alt="Pokal"
        style={{
          width: "100%",
          height: "auto",
          objectFit: "contain",
        }}
      />
    </div>
  );
}

function ConnectorLayer({ rounds }: { rounds: Record<string, MatchData[]> }) {
  const r1 = rounds.R1 || [];
  const r2 = rounds.R2 || [];
  const r3 = rounds.R3 || [];
  const r4 = rounds.R4 || [];
  const r5 = rounds.R5 || [];
  const l1 = rounds.L1 || [];
  const l2 = rounds.L2 || [];
  const l3 = rounds.L3 || [];
  const l4 = rounds.L4 || [];
  const l5 = rounds.L5 || [];
  const l6 = rounds.L6 || [];
  const l7 = rounds.L7 || [];
  const l8 = rounds.L8 || [];
  const finale = rounds.F || [];

  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} viewBox={`0 0 ${boardW - 40} ${boardH}`}>
      <g stroke={palette.line} strokeWidth="1" fill="none" strokeLinecap="square">
        {groupConnectors(r1, r2, "right")}
        {groupConnectors(r2, r3, "right")}
        {groupConnectors(r3, r4, "right")}
        {groupConnectors(r4, r5, "right")}
        {groupConnectors(l1, l2, "left", false)}
        {groupConnectors(l2, l3, "left")}
        {groupConnectors(l3, l4, "left", false)}
        {groupConnectors(l4, l5, "left")}
        {groupConnectors(l5, l6, "left", false)}
        {groupConnectors(l6, l7, "left")}
        {l7[0] && l8[0] ? customConnector(l7[0], l8[0], "left", "l7-l8") : null}
        {r5[0] && finale[0] ? customConnector(r5[0], finale[0], "right", "r5-finale") : null}
        {l8[0] && finale[0] ? (
          <>
            <line x1={l8[0].originX} y1={yMid(l8[0])} x2={l8[0].originX - 18} y2={yMid(l8[0])} />
            <line x1={l8[0].originX - 18} y1={yMid(l8[0])} x2={l8[0].originX - 18} y2={boardH - 440} />
            <line x1={l8[0].originX - 18} y1={boardH - 440} x2={finale[0].originX + 15} y2={boardH - 440} />
            <line x1={finale[0].originX + 15} y1={boardH - 440} x2={finale[0].originX + 15} y2={yMid(finale[0])} />
          </>
        ) : null}
      </g>
    </svg>
  );
}

export default function App() {
  const effectiveTemplate = withOffsets(frozenTemplate, 29, 3, -6);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [players, setPlayers] = useState<DbPlayer[]>([]);
  const [tournament, setTournament] = useState<DbTournament | null>(null);
  const [error, setError] = useState("");
  const [fitScale, setFitScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState<number | null>(null);

  const fitOuterRef = useRef<HTMLDivElement | null>(null);
  const fitInnerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      const { data: matchData, error: matchError } = await supabase
        .from("matches_with_names")
        .select("id, match_no, bracket, source_top, source_bottom, player_top_name, player_bottom_name, sets_top, sets_bottom, x_pos, y_pos, best_of")
        .eq("tournament_id", TOURNAMENT_ID)
        .order("match_no", { ascending: true });

      if (ignore) return;
      if (matchError) {
        setError(matchError.message);
        return;
      }

      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .select("id, seed_no, display_name, is_active")
        .eq("tournament_id", TOURNAMENT_ID)
        .order("seed_no", { ascending: true });

      if (ignore) return;
      if (playerError) {
        setError(playerError.message);
        return;
      }

      const { data: tournamentData, error: tournamentError } = await supabase
        .from("tournaments")
        .select("id, title, homepage_news, show_homepage_news, play_until_text, finals_text")
        .eq("id", TOURNAMENT_ID)
        .single();

      if (ignore) return;
      if (tournamentError) {
        setError(tournamentError.message);
        return;
      }

      setError("");
      setMatches((matchData || []).map((row) => normalizeMatch(row as DbMatch)));
      setPlayers(((playerData || []) as DbPlayer[]).filter((p) => p.is_active !== false));
      setTournament((tournamentData || null) as DbTournament | null);
    };

    loadData();

    const channel = supabase
      .channel("matches-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "matches" }, loadData)
      .on("postgres_changes", { event: "*", schema: "public", table: "players" }, loadData)
      .on("postgres_changes", { event: "*", schema: "public", table: "tournaments" }, loadData)
      .subscribe();

    return () => {
      ignore = true;
      supabase.removeChannel(channel);
    };
  }, []);

  useLayoutEffect(() => {
    const updateScale = () => {
      const outer = fitOuterRef.current;
      const inner = fitInnerRef.current;
      if (!outer || !inner) return;

      const naturalWidth = inner.scrollWidth;
      const naturalHeight = inner.scrollHeight;

      if (!naturalWidth || !naturalHeight) return;

      const mobilePadding = window.innerWidth <= 900 ? 8 : 24;
      const availableWidth = Math.max(280, window.innerWidth - mobilePadding * 2);
      const nextScale = Math.min(availableWidth / naturalWidth, 1);

      setFitScale(nextScale);
      setScaledHeight(Math.ceil(naturalHeight * nextScale));
    };

    updateScale();

    const resizeObserver = new ResizeObserver(() => updateScale());
    if (fitInnerRef.current) resizeObserver.observe(fitInnerRef.current);
    if (fitOuterRef.current) resizeObserver.observe(fitOuterRef.current);

    window.addEventListener("resize", updateScale);
    window.addEventListener("orientationchange", updateScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScale);
      window.removeEventListener("orientationchange", updateScale);
    };
  }, [matches, players, tournament, error]);

  const rounds = useMemo(() => {
    const groups: Record<string, MatchData[]> = {};
    const classify = (matchNo: number) =>
      matchNo >= 1 && matchNo <= 16 ? "R1" :
      matchNo >= 17 && matchNo <= 24 ? "R2" :
      matchNo >= 25 && matchNo <= 32 ? "L1" :
      matchNo >= 33 && matchNo <= 36 ? "R3" :
      matchNo >= 37 && matchNo <= 44 ? "L2" :
      matchNo >= 45 && matchNo <= 48 ? "L3" :
      matchNo >= 49 && matchNo <= 50 ? "R4" :
      matchNo >= 51 && matchNo <= 54 ? "L4" :
      matchNo >= 55 && matchNo <= 56 ? "L5" :
      matchNo === 57 ? "R5" :
      matchNo >= 58 && matchNo <= 59 ? "L6" :
      matchNo === 60 ? "L7" :
      matchNo === 61 ? "L8" :
      matchNo === 62 ? "F" : "X";

    for (const match of matches) {
      const key = classify(match.matchNo);
      if (!groups[key]) groups[key] = [];
      groups[key].push(match);
    }

    for (const key of Object.keys(groups)) {
      groups[key].sort((a, b) => a.matchNo - b.matchNo);
    }

    return groups;
  }, [matches]);

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        padding: typeof window !== "undefined" && window.innerWidth <= 900 ? 8 : 24,
        background: palette.page,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          margin: "0 auto 8px auto",
          maxWidth: boardW,
          color: palette.text,
          fontSize: 13,
          textAlign: "center",
          opacity: 0.8,
        }}
      >
        Mobilansicht: automatisch eingepasst. Danach normal mit Browser-Zoom vergrößerbar.
      </div>

      <div
        ref={fitOuterRef}
        style={{
          width: "100%",
          maxWidth: boardW,
          margin: "0 auto",
          height: scaledHeight ?? "auto",
          position: "relative",
          overflow: "visible",
        }}
      >
        <div
          ref={fitInnerRef}
          style={{
            width: boardW,
            transform: `scale(${fitScale})`,
            transformOrigin: "top left",
          }}
        >
          <div
            style={{
              width: boardW,
              margin: "0 auto",
              background: palette.board,
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              boxSizing: "border-box",
            }}
          >
            <div style={{ marginBottom: 8, color: palette.text, fontSize: 34, fontWeight: 700, textAlign: "center" }}>
              {tournament?.title || "3. Resi Tischtennisturnier 2026"}
            </div>

            <div
              style={{
                marginBottom: 16,
                color: palette.text,
                fontSize: 16,
                fontWeight: 600,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ transform: "translateX(150px)" }}>
                {tournament?.finals_text || "Endrunde am xx.xx.2026"}
              </div>
              <div>
                {tournament?.play_until_text || 'Zu spielen bis "xx.xx.2026"'}
              </div>
              <div style={{ transform: "translateX(-200px)" }}>
                {tournament?.finals_text || "Endrunde am xx.xx.2026"}
              </div>
            </div>

            {error ? (
              <div
                style={{
                  marginBottom: 12,
                  padding: 12,
                  background: "#fff3f3",
                  color: "#8a1f1f",
                  border: "1px solid #d9a0a0",
                  borderRadius: 8,
                }}
              >
                Supabase-Fehler: {error}
              </div>
            ) : null}

            <div
              style={{
                position: "relative",
                width: boardW - 40,
                height: 1080,
                overflow: "hidden",
                border: `1px solid ${palette.border}`,
                borderRadius: 12,
                background: "rgba(57, 173, 255, 0.18)",
                boxSizing: "border-box",
              }}
            >
              <div
                style={abs(dividerLeftX, 0, {
                  width: Math.max(0, dividerRightX - dividerLeftX),
                  height: "100%",
                  background: palette.middleBand,
                })}
              />
              <ConnectorLayer rounds={rounds} />

              <div style={abs(938, 64, { color: palette.blue, fontSize: 16, fontWeight: 700 })}>R1</div>
              <div style={abs(1028, 64, { color: palette.blue, fontSize: 16, fontWeight: 700 })}>R2</div>
              <div style={abs(1123, 64, { color: palette.blue, fontSize: 16, fontWeight: 700 })}>R3</div>
              <div style={abs(1208, 64, { color: palette.blue, fontSize: 16, fontWeight: 700 })}>R4</div>
              <div style={abs(1293, 64, { color: palette.blue, fontSize: 16, fontWeight: 700 })}>R5</div>
              <div style={abs(1378, 64, { color: palette.blue, fontSize: 16, fontWeight: 700 })}>Finale</div>
              <div style={abs(683, 64, { color: palette.blue, fontSize: 16, fontWeight: 700 })}>L1</div>
              <div style={abs(593, 64, { color: palette.blue, fontSize: 16, fontWeight: 700 })}>L2</div>
              <div style={abs(503, 64, { color: palette.blue, fontSize: 16, fontWeight: 700 })}>L3</div>
              <div style={abs(416, 64, { color: palette.blue, fontSize: 16, fontWeight: 700 })}>L4</div>
              <div style={abs(329, 64, { color: palette.blue, fontSize: 16, fontWeight: 700 })}>L5</div>
              <div style={abs(242, 64, { color: palette.blue, fontSize: 16, fontWeight: 700 })}>L6</div>
              <div style={abs(155, 64, { color: palette.blue, fontSize: 16, fontWeight: 700 })}>L7</div>
              <div style={abs(68, 64, { color: palette.blue, fontSize: 16, fontWeight: 700 })}>L8</div>

              <Meldeliste players={players} />
              {matches.map((match) => <MatchBox key={match.id} match={match} template={effectiveTemplate} />)}
              <NewsPanel text={tournament?.homepage_news ?? ""} visible={tournament?.show_homepage_news ?? false} />
              <TrophyPanel />
              <BestOfLegend />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
