import type { SusScoreCalculation } from "../type/sus";

export function calculateSusScore(
  answers: { score: number; question_id?: number }[],
  isStandardSus: boolean = true,
): SusScoreCalculation {
  if (!answers || answers.length === 0) {
    return {
      rawScore: 0,
      maxRawScore: 0,
      susScore: 0,
      grade: "F",
      adjectiveRating: "Belum Ada Nilai",
      acceptability: "Not Acceptable",
    };
  }

  const rawScore = answers.reduce((sum, a) => sum + (a.score || 0), 0);
  const maxRawScore = answers.length * 5;

  let susScore = 0;

  // Standard SUS 10-item calculation
  if (isStandardSus && answers.length === 10) {
    let contributionSum = 0;
    answers.forEach((ans, index) => {
      const itemNumber = index + 1;
      const score = Math.min(5, Math.max(1, ans.score));
      if (itemNumber % 2 !== 0) {
        // Odd items: score - 1
        contributionSum += score - 1;
      } else {
        // Even items: 5 - score
        contributionSum += 5 - score;
      }
    });
    susScore = Math.round(contributionSum * 2.5 * 10) / 10;
  } else {
    // Proportional scale normalized to 100
    susScore = Math.round((rawScore / maxRawScore) * 100 * 10) / 10;
  }

  let grade = "F";
  let adjectiveRating = "Poor";
  let acceptability = "Not Acceptable";

  if (susScore >= 85) {
    grade = "A+";
    adjectiveRating = "Best Imaginable (Sangat Luar Biasa)";
    acceptability = "Acceptable";
  } else if (susScore >= 80.3) {
    grade = "A";
    adjectiveRating = "Excellent (Sangat Baik)";
    acceptability = "Acceptable";
  } else if (susScore >= 68) {
    grade = "B";
    adjectiveRating = "Good (Baik / Di Atas Rata-rata Industri)";
    acceptability = "Acceptable";
  } else if (susScore >= 51) {
    grade = "C";
    adjectiveRating = "OK (Cukup / Marginal)";
    acceptability = "Marginal";
  } else {
    grade = "F";
    adjectiveRating = "Poor (Perlu Peningkatan Signifikan)";
    acceptability = "Not Acceptable";
  }

  return {
    rawScore,
    maxRawScore,
    susScore,
    grade,
    adjectiveRating,
    acceptability,
  };
}
