/* ============================================================
   연봉 실수령액 계산기 로직 (2025~2026 기준, 예상 참고용)
   - 4대보험: 국민연금 4.5%, 건강보험 3.545%, 장기요양(건보료×12.95%), 고용보험 0.9%
   - 소득세: 근로소득공제 + 인적공제 반영한 연말정산 근사치 ÷ 12
   ============================================================ */

const won = (n) => Math.round(n).toLocaleString("ko-KR") + "원";

// 4대보험 요율
const RATE_PENSION = 0.045;      // 국민연금 (근로자 부담)
const RATE_HEALTH = 0.03545;     // 건강보험 (근로자 부담)
const RATE_CARE = 0.1295;        // 장기요양 = 건강보험료 × 12.95%
const RATE_EMPLOY = 0.009;       // 고용보험 (근로자 부담)

// 국민연금 기준소득월액 상·하한 (2024.7~)
const PENSION_MAX_BASE = 6170000;
const PENSION_MIN_BASE = 390000;

// 근로소득공제 (연간)
function earnedIncomeDeduction(gross) {
  if (gross <= 5000000) return gross * 0.7;
  if (gross <= 15000000) return 3500000 + (gross - 5000000) * 0.4;
  if (gross <= 45000000) return 7500000 + (gross - 15000000) * 0.15;
  if (gross <= 100000000) return 12000000 + (gross - 45000000) * 0.05;
  return Math.min(14750000 + (gross - 100000000) * 0.02, 20000000);
}

// 종합소득세 산출세액 (과세표준 기준, 누진공제 방식)
function incomeTaxByBase(base) {
  if (base <= 0) return 0;
  if (base <= 14000000) return base * 0.06;
  if (base <= 50000000) return base * 0.15 - 1260000;
  if (base <= 88000000) return base * 0.24 - 5760000;
  if (base <= 150000000) return base * 0.35 - 15440000;
  if (base <= 300000000) return base * 0.38 - 19940000;
  if (base <= 500000000) return base * 0.40 - 25940000;
  if (base <= 1000000000) return base * 0.42 - 35940000;
  return base * 0.45 - 65940000;
}

// 근로소득 세액공제
function earnedTaxCredit(calculatedTax, gross) {
  let credit = calculatedTax <= 1300000
    ? calculatedTax * 0.55
    : 715000 + (calculatedTax - 1300000) * 0.30;
  // 총급여 구간별 한도
  let limit;
  if (gross <= 33000000) limit = 740000;
  else if (gross <= 70000000) limit = Math.max(660000, 740000 - (gross - 33000000) * 0.008);
  else if (gross <= 120000000) limit = Math.max(500000, 660000 - (gross - 70000000) * 0.5);
  else limit = Math.max(200000, 500000 - (gross - 120000000) * 0.5);
  return Math.min(credit, limit);
}

function calculate() {
  const salaryManwon = parseFloat(document.getElementById("salary").value) || 0;
  const nontaxManwon = parseFloat(document.getElementById("nontax").value) || 0;
  const family = parseInt(document.getElementById("family").value) || 1;

  if (salaryManwon <= 0) {
    alert("연봉을 입력해주세요. (예: 3600)");
    return;
  }

  const annualGross = salaryManwon * 10000;         // 연봉(원)
  const monthlyGross = annualGross / 12;             // 월 급여(세전)
  const monthlyNontax = nontaxManwon * 10000;        // 월 비과세
  const monthlyTaxable = Math.max(0, monthlyGross - monthlyNontax); // 월 과세소득

  // --- 4대보험 (월) ---
  const pensionBase = Math.min(Math.max(monthlyTaxable, PENSION_MIN_BASE), PENSION_MAX_BASE);
  const pension = pensionBase * RATE_PENSION;
  const health = monthlyTaxable * RATE_HEALTH;
  const care = health * RATE_CARE;
  const employ = monthlyTaxable * RATE_EMPLOY;

  // --- 소득세 (연말정산 근사치) ---
  const annualTaxableSalary = monthlyTaxable * 12;   // 연 과세급여(총급여)
  const eiDeduction = earnedIncomeDeduction(annualTaxableSalary);
  const earnedIncome = annualTaxableSalary - eiDeduction;   // 근로소득금액
  const personalDeduction = 1500000 * family;               // 인적공제(기본)
  const pensionDeductionYear = pension * 12;                 // 국민연금보험료 공제
  const taxBase = Math.max(0, earnedIncome - personalDeduction - pensionDeductionYear);

  const calcTax = incomeTaxByBase(taxBase);
  const credit = earnedTaxCredit(calcTax, annualTaxableSalary);
  const annualIncomeTax = Math.max(0, calcTax - credit);
  const incomeTax = annualIncomeTax / 12;            // 월 소득세
  const localTax = incomeTax * 0.10;                 // 지방소득세

  // --- 합계 ---
  const totalDeduction = pension + health + care + employ + incomeTax + localTax;
  const netMonthly = monthlyGross - totalDeduction;
  const netYearly = netMonthly * 12;

  // --- 출력 ---
  document.getElementById("netMonthly").textContent = won(netMonthly);
  document.getElementById("netMonthly2").textContent = won(netMonthly);
  document.getElementById("netYearly").textContent = "연 " + won(netYearly);
  document.getElementById("grossMonthly").textContent = won(monthlyGross);
  document.getElementById("pension").textContent = won(pension);
  document.getElementById("health").textContent = won(health);
  document.getElementById("care").textContent = won(care);
  document.getElementById("employ").textContent = won(employ);
  document.getElementById("incomeTax").textContent = won(incomeTax);
  document.getElementById("localTax").textContent = won(localTax);
  document.getElementById("totalDeduction").textContent = won(totalDeduction);

  document.getElementById("result").hidden = false;
  document.getElementById("result").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

document.getElementById("calcBtn").addEventListener("click", calculate);
document.getElementById("salary").addEventListener("keydown", (e) => {
  if (e.key === "Enter") calculate();
});
