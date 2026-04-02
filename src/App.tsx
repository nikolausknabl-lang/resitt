import React from "react";

type Template = {
  box: { x: number; y: number };
  name1: { x: number; y: number };
  name2: { x: number; y: number };
  score1: { x: number; y: number };
  score2: { x: number; y: number };
};

type MatchData = {
  id: string;
  p1: string;
  p2: string;
  originX: number;
  originY: number;
};

const palette = {
  page: "#e4cd6f",
  board: "#efe8c7",
  winner: "#dcedfb",
  border: "#8d6d1f",
  text: "#1f2a37",
  blue: "#3b74b6",
  middleBand: "rgba(0,0,0,0.06)",
  line: "#7b6320",
};

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

const players = [
  "Simon", "Paul", "Andreas", "Anton", "Jakob", "Malte", "Noah", "Dennis",
  "Tim", "Bastian", "Michael", "Vincent", "Finn", "Marvin", "Daniel", "Lukas",
  "Marcel", "Konrad", "David", "Alexander", "Matteo", "Adrian", "Lorenz", "Kilian",
  "Julian", "Georg", "Robin", "Richard", "Philipp", "Kevin", "Ben", "Felix",
];

const winnersR1: MatchData[] = [
  { id: "1", p1: "Simon", p2: "Paul", originX: 905, originY: 110 },
  { id: "2", p1: "Andreas", p2: "Anton", originX: 905, originY: 168 },
  { id: "3", p1: "Jakob", p2: "Malte", originX: 905, originY: 226 },
  { id: "4", p1: "Noah", p2: "Dennis", originX: 905, originY: 284 },
  { id: "5", p1: "Tim", p2: "Bastian", originX: 905, originY: 342 },
  { id: "6", p1: "Michael", p2: "Vincent", originX: 905, originY: 400 },
  { id: "7", p1: "Finn", p2: "Marvin", originX: 905, originY: 458 },
  { id: "8", p1: "Daniel", p2: "Lukas", originX: 905, originY: 516 },
  { id: "9", p1: "Marcel", p2: "Konrad", originX: 905, originY: 574 },
  { id: "10", p1: "David", p2: "Alexander", originX: 905, originY: 632 },
  { id: "11", p1: "Matteo", p2: "Adrian", originX: 905, originY: 690 },
  { id: "12", p1: "Lorenz", p2: "Kilian", originX: 905, originY: 748 },
  { id: "13", p1: "Julian", p2: "Georg", originX: 905, originY: 806 },
  { id: "14", p1: "Robin", p2: "Richard", originX: 905, originY: 864 },
  { id: "15", p1: "Philipp", p2: "Kevin", originX: 905, originY: 922 },
  { id: "16", p1: "Ben", p2: "Felix", originX: 905, originY: 980 },
];

const winnersR2: MatchData[] = [
  { id: "17", p1: "W1", p2: "W2", originX: 1000, originY: 139 },
  { id: "18", p1: "W3", p2: "W4", originX: 1000, originY: 255 },
  { id: "19", p1: "W5", p2: "W6", originX: 1000, originY: 371 },
  { id: "20", p1: "W7", p2: "W8", originX: 1000, originY: 487 },
  { id: "21", p1: "W9", p2: "W10", originX: 1000, originY: 603 },
  { id: "22", p1: "W11", p2: "W12", originX: 1000, originY: 719 },
  { id: "23", p1: "W13", p2: "W14", originX: 1000, originY: 835 },
  { id: "24", p1: "W15", p2: "W16", originX: 1000, originY: 951 },
];

const winnersR3: MatchData[] = [
  { id: "33", p1: "W17", p2: "W18", originX: 1095, originY: 197 },
  { id: "34", p1: "W19", p2: "W20", originX: 1095, originY: 429 },
  { id: "35", p1: "W21", p2: "W22", originX: 1095, originY: 661 },
  { id: "36", p1: "W23", p2: "W24", originX: 1095, originY: 893 },
];

const winnersR4: MatchData[] = [
  { id: "49", p1: "W33", p2: "W34", originX: 1180, originY: 313 },
  { id: "50", p1: "W35", p2: "W36", originX: 1180, originY: 777 },
];

const winnersR5: MatchData[] = [
  { id: "57", p1: "W49", p2: "W50", originX: 1265, originY: 545 },
];

const losersR1: MatchData[] = [
  { id: "25", p1: "L1", p2: "L2", originX: 655, originY: 139 },
  { id: "26", p1: "L3", p2: "L4", originX: 655, originY: 255 },
  { id: "27", p1: "L5", p2: "L6", originX: 655, originY: 371 },
  { id: "28", p1: "L7", p2: "L8", originX: 655, originY: 487 },
  { id: "29", p1: "L9", p2: "L10", originX: 655, originY: 603 },
  { id: "30", p1: "L11", p2: "L12", originX: 655, originY: 719 },
  { id: "31", p1: "L13", p2: "L14", originX: 655, originY: 835 },
  { id: "32", p1: "L15", p2: "L16", originX: 655, originY: 951 },
];

const losersR2: MatchData[] = [
  { id: "37", p1: "W25", p2: "L18", originX: 565, originY: 139 },
  { id: "38", p1: "W26", p2: "L17", originX: 565, originY: 255 },
  { id: "39", p1: "W27", p2: "L20", originX: 565, originY: 371 },
  { id: "40", p1: "W28", p2: "L19", originX: 565, originY: 487 },
  { id: "41", p1: "W29", p2: "L22", originX: 565, originY: 603 },
  { id: "42", p1: "W30", p2: "L21", originX: 565, originY: 719 },
  { id: "43", p1: "W31", p2: "L24", originX: 565, originY: 835 },
  { id: "44", p1: "W32", p2: "L23", originX: 565, originY: 951 },
];

const losersR3: MatchData[] = [
  { id: "45", p1: "W37", p2: "W38", originX: 475, originY: 197 },
  { id: "46", p1: "W39", p2: "W40", originX: 475, originY: 429 },
  { id: "47", p1: "W41", p2: "W42", originX: 475, originY: 661 },
  { id: "48", p1: "W43", p2: "W44", originX: 475, originY: 893 },
];

const losersR4: MatchData[] = [
  { id: "51", p1: "W45", p2: "L49", originX: 388, originY: 197 },
  { id: "52", p1: "W46", p2: "L50", originX: 388, originY: 429 },
  { id: "53", p1: "W47", p2: "L49", originX: 388, originY: 661 },
  { id: "54", p1: "W48", p2: "L50", originX: 388, originY: 893 },
];

const losersR5: MatchData[] = [
  { id: "55", p1: "W51", p2: "W52", originX: 301, originY: 313 },
  { id: "56", p1: "W53", p2: "W54", originX: 301, originY: 777 },
];

const losersR6: MatchData[] = [
  { id: "58", p1: "W55", p2: "L57", originX: 214, originY: 313 },
  { id: "59", p1: "W56", p2: "L57", originX: 214, originY: 777 },
];

const losersR7: MatchData[] = [
  { id: "60", p1: "W58", p2: "W59", originX: 127, originY: 545 },
];

const losersR8: MatchData[] = [
  { id: "61", p1: "W60", p2: "L57", originX: 40, originY: 545 },
];

const finale: MatchData[] = [
  { id: "62", p1: "W57", p2: "W61", originX: 1375, originY: 545 },
];

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
function xRight(match: MatchData) { return match.originX + boxW; }
function xLeft(match: MatchData) { return match.originX; }
function targetOriginRight(match: MatchData) { return match.originX + boxW; }

function groupConnectors(from: MatchData[], to: MatchData[], direction: "right" | "left", drawVertical: boolean = true) {
  const lines: React.ReactNode[] = [];
  const cap = Math.min(Math.floor(from.length / 2), to.length);
  for (let i = 0; i < cap; i++) {
    const a = from[i * 2];
    const b = from[i * 2 + 1];
    const target = to[i];
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

function ConnectorLayer() {
  return (
    <svg style={{ position: "absolute", inset: 0, pointerEvents: "none" }} viewBox={`0 0 ${boardW - 40} ${boardH}`}>
      <g stroke={palette.line} strokeWidth="1" fill="none" strokeLinecap="square">
        {groupConnectors(winnersR1, winnersR2, "right")}
        {groupConnectors(winnersR2, winnersR3, "right")}
        {groupConnectors(winnersR3, winnersR4, "right")}
        {groupConnectors(winnersR4, winnersR5, "right")}
        {groupConnectors(losersR1, losersR2, "left", false)}
        {groupConnectors(losersR2, losersR3, "left")}
        {groupConnectors(losersR3, losersR4, "left", false)}
        {groupConnectors(losersR4, losersR5, "left")}
        {groupConnectors(losersR5, losersR6, "left", false)}
        {groupConnectors(losersR6, losersR7, "left")}
        {customConnector(losersR7[0], losersR8[0], "left", "l7-l8")}
        {customConnector(winnersR5[0], finale[0], "right", "r5-finale")}
        <line x1={losersR8[0].originX} y1={yMid(losersR8[0])} x2={losersR8[0].originX - 18} y2={yMid(losersR8[0])} />
        <line x1={losersR8[0].originX - 18} y1={yMid(losersR8[0])} x2={losersR8[0].originX - 18} y2={boardH - 440} />
        <line x1={losersR8[0].originX - 18} y1={boardH - 440} x2={finale[0].originX + 15} y2={boardH - 440} />
        <line x1={finale[0].originX + 15} y1={boardH - 440} x2={finale[0].originX + 15} y2={yMid(finale[0])} />
      </g>
    </svg>
  );
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

  return (
    <>
      <div style={abs(match.originX, match.originY, { width: boxW, height: boxH, background: palette.winner, border: `1px solid ${palette.border}`, borderRadius: 7, boxShadow: "0 1px 2px rgba(0,0,0,0.12)", boxSizing: "border-box" })} />
      <div style={abs(match.originX, match.originY, { width: boxW, height: boxH, color: palette.text, fontSize: 18, fontWeight: 700, lineHeight: `${boxH}px`, textAlign: "center" })}>{match.id}</div>
      <div style={abs(match.originX, name1Top, { width: boxW, color: palette.text, fontSize: nameFontSize, textAlign: "center", lineHeight: 1 })}>{match.p1}</div>
      <div style={abs(match.originX, name2Top, { width: boxW, color: palette.text, fontSize: nameFontSize, textAlign: "center", lineHeight: 1 })}>{match.p2}</div>
      <div style={abs(scoreColumnX, match.originY, { width: 1, height: boxH, background: palette.border })} />
      <div style={abs(scoreColumnX, scoreMidY, { width: scoreWidth, height: 1, background: palette.border })} />
      <div style={abs(scoreColumnX, score1Top, { width: scoreWidth, height: 10, color: palette.text, fontSize: 11, fontWeight: 600, lineHeight: "10px", textAlign: "center" })}>2</div>
      <div style={abs(scoreColumnX, score2Top, { width: scoreWidth, height: 10, color: palette.text, fontSize: 11, fontWeight: 600, lineHeight: "10px", textAlign: "center" })}>1</div>
    </>
  );
}

function Meldeliste() {
  return (
    <>
      <div style={abs(780, 64, { color: palette.text, fontSize: 16, fontWeight: 700 })}>Meldeliste</div>
      <div style={abs(765, 110, { width: 120 })}>
        {players.map((name, i) => {
          const top = 14 + i * 29 - 23;
          return (
            <div key={name} style={abs(0, top, { right: 0, color: palette.text, fontSize: listFontSize, lineHeight: 1 })}>
              <div style={abs(0, 14, { right: 0, height: 1, background: palette.border, opacity: 0.8 })} />
              <span style={{ display: "inline-block", width: 20, textAlign: "right" }}>{i + 1}</span>
              <span style={{ marginLeft: 8 }}>{name}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default function App() {
  const effectiveTemplate = withOffsets(frozenTemplate, 29, 3, -6);

  return (
    <div style={{ minHeight: "100vh", width: "100%", overflow: "auto", padding: 24, background: palette.page }}>
      <div style={{ width: boardW, margin: "0 auto", background: palette.board, borderRadius: 16, padding: 20, boxShadow: "0 10px 30px rgba(0,0,0,0.15)", boxSizing: "border-box" }}>
        <div style={{ marginBottom: 8, color: palette.text, fontSize: 34, fontWeight: 700, textAlign: "center" }}>3. Resi Tischtennisturnier 2026</div>
        <div style={{ marginBottom: 16, color: palette.text, fontSize: 16, fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ transform: "translateX(150px)" }}>Endrunde am xx.xx.2026</div>
          <div>Zu spielen bis "xx.xx.2026"</div>
          <div style={{ transform: "translateX(-200px)" }}>Endrunde am xx.xx.2026</div>
        </div>

        <div style={{ position: "relative", width: boardW - 40, height: 1080, overflow: "hidden", border: `1px solid ${palette.border}`, borderRadius: 12, background: "rgba(255,255,255,0.18)", boxSizing: "border-box" }}>
          <div style={abs(dividerLeftX, 0, { width: Math.max(0, dividerRightX - dividerLeftX), height: "100%", background: palette.middleBand })} />
          <ConnectorLayer />

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

          <Meldeliste />
          {winnersR1.map((match) => <MatchBox key={match.id} match={match} template={effectiveTemplate} />)}
          {winnersR2.map((match) => <MatchBox key={match.id} match={match} template={effectiveTemplate} />)}
          {winnersR3.map((match) => <MatchBox key={match.id} match={match} template={effectiveTemplate} />)}
          {winnersR4.map((match) => <MatchBox key={match.id} match={match} template={effectiveTemplate} />)}
          {winnersR5.map((match) => <MatchBox key={match.id} match={match} template={effectiveTemplate} />)}
          {finale.map((match) => <MatchBox key={match.id} match={match} template={effectiveTemplate} />)}
          {losersR1.map((match) => <MatchBox key={match.id} match={match} template={effectiveTemplate} />)}
          {losersR2.map((match) => <MatchBox key={match.id} match={match} template={effectiveTemplate} />)}
          {losersR3.map((match) => <MatchBox key={match.id} match={match} template={effectiveTemplate} />)}
          {losersR4.map((match) => <MatchBox key={match.id} match={match} template={effectiveTemplate} />)}
          {losersR5.map((match) => <MatchBox key={match.id} match={match} template={effectiveTemplate} />)}
          {losersR6.map((match) => <MatchBox key={match.id} match={match} template={effectiveTemplate} />)}
          {losersR7.map((match) => <MatchBox key={match.id} match={match} template={effectiveTemplate} />)}
          {losersR8.map((match) => <MatchBox key={match.id} match={match} template={effectiveTemplate} />)}
        </div>
      </div>
    </div>
  );
}
