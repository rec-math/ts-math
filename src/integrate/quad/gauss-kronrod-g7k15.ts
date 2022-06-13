import type { IntegrandCallback, IntegrationStep } from '.';

// Export the API.
export { integrationStep };

// Gauss-Kronrod constants (G7, K15) on [-1, 1].
// https://www.advanpix.com/2011/11/07/gauss-kronrod-quadrature-nodes-weights/

//    node_g0k0 = 0;
//    node_g1k2 = 4.058451513773971669066064120769615e-01 exact;
const node_g1k2 = 0.4058451513773972;
//    node_g2k4 = 7.415311855993944398638647732807884e-01 exact;
const node_g2k4 = 0.7415311855993945;
//    node_g3k6 = 9.491079123427585245261896840478513e-01 exact;
const node_g3k6 = 0.9491079123427585;

//    node_k1 = 2.077849550078984676006894037732449e-01 exact;
const node_k1 = 0.20778495500789848;
//    node_k3 = 5.860872354676911302941448382587296e-01 exact;
const node_k3 = 0.5860872354676911;
//    node_k5 = 8.648644233597690727897127886409262e-01 exact;
const node_k5 = 0.8648644233597691;
//    node_k7 = 9.914553711208126392068546975263285e-01 exact;
const node_k7 = 0.9914553711208126;

//    weight_g0 = 4.179591836734693877551020408163265e-01 exact;
const weight_g0 = 0.4179591836734694;
//    weight_g1 = 3.818300505051189449503697754889751e-01 exact;
const weight_g1 = 0.3818300505051189;
//    weight_g2 = 2.797053914892766679014677714237796e-01 exact;
const weight_g2 = 0.27970539148927664;
//    weight_g3 = 1.294849661688696932706114326790820e-01 exact;
const weight_g3 = 0.1294849661688697;

//    weight_k0 = 2.094821410847278280129991748917143e-01 exact;
const weight_k0 = 0.20948214108472782;
//    weight_k1 = 2.044329400752988924141619992346491e-01 exact;
const weight_k1 = 0.20443294007529889;
//    weight_k2 = 1.903505780647854099132564024210137e-01 exact;
const weight_k2 = 0.19035057806478542;
//    weight_k3 = 1.690047266392679028265834265985503e-01 exact;
const weight_k3 = 0.1690047266392679;
//    weight_k4 = 1.406532597155259187451895905102379e-01 exact;
const weight_k4 = 0.14065325971552592;
//    weight_k5 = 1.047900103222501838398763225415180e-01 exact;
const weight_k5 = 0.10479001032225019;
//    weight_k6 = 6.309209262997855329070066318920429e-02 exact;
const weight_k6 = 0.06309209262997856;
//    weight_k7 = 2.293532201052922496373200805896959e-02 exact;
const weight_k7 = 0.022935322010529224;

/**
 * Perform a single integration step.
 *
 * @param f Integrand callback.
 * @param a Lower limit.
 * @param b Upper limit.
 * @returns [current best estimate, poor estimate]
 */
const integrationStep: IntegrationStep = (
  f: IntegrandCallback, // Integrand.
  a: number, // Lower limit.
  b: number, // Upper limit.
): [a: number, b: number] => {
  // Gauss-Kronrod (G7, K15).
  const scale = (b - a) / 2;
  const offset = (a + b) / 2;

  // const scaled_g0k0 = 0;
  const scaled_k1 = node_k1 * scale;
  const scaled_g1k2 = node_g1k2 * scale;
  const scaled_k3 = node_k3 * scale;
  const scaled_g2k4 = node_g2k4 * scale;
  const scaled_k5 = node_k5 * scale;
  const scaled_g3k6 = node_g3k6 * scale;
  const scaled_k7 = node_k7 * scale;

  const scaled_weight_g0 = weight_g0 * scale;
  const scaled_weight_g1 = weight_g1 * scale;
  const scaled_weight_g2 = weight_g2 * scale;
  const scaled_weight_g3 = weight_g3 * scale;

  const scaled_weight_k0 = weight_k0 * scale;
  const scaled_weight_k1 = weight_k1 * scale;
  const scaled_weight_k2 = weight_k2 * scale;
  const scaled_weight_k3 = weight_k3 * scale;
  const scaled_weight_k4 = weight_k4 * scale;
  const scaled_weight_k5 = weight_k5 * scale;
  const scaled_weight_k6 = weight_k6 * scale;
  const scaled_weight_k7 = weight_k7 * scale;

  const f_g0k0 = f(offset);

  const f_k1_h = f(offset + scaled_k1);
  const f_k1_l = f(offset - scaled_k1);
  const f_g1k2_h = f(offset + scaled_g1k2);
  const f_g1k2_l = f(offset - scaled_g1k2);

  const f_k3_h = f(offset + scaled_k3);
  const f_k3_l = f(offset - scaled_k3);
  const f_g2k4_h = f(offset + scaled_g2k4);
  const f_g2k4_l = f(offset - scaled_g2k4);

  const f_k5_h = f(offset + scaled_k5);
  const f_k5_l = f(offset - scaled_k5);
  const f_g3k6_h = f(offset + scaled_g3k6);
  const f_g3k6_l = f(offset - scaled_g3k6);

  const f_k7_h = f(offset + scaled_k7);
  const f_k7_l = f(offset - scaled_k7);

  const poorEstimate =
    scaled_weight_g0 * f_g0k0 + // g0
    scaled_weight_g1 * (f_g1k2_h + f_g1k2_l) + // g1
    scaled_weight_g2 * (f_g2k4_h + f_g2k4_l) + // g2
    scaled_weight_g3 * (f_g3k6_h + f_g3k6_l); // g3

  const currentEstimate =
    scaled_weight_k0 * f_g0k0 + // k0
    scaled_weight_k1 * (f_k1_h + f_k1_l) + // k1
    scaled_weight_k2 * (f_g1k2_h + f_g1k2_l) + // k2
    scaled_weight_k3 * (f_k3_h + f_k3_l) + // k3
    scaled_weight_k4 * (f_g2k4_h + f_g2k4_l) + // k4
    scaled_weight_k5 * (f_k5_h + f_k5_l) + // k5
    scaled_weight_k6 * (f_g3k6_h + f_g3k6_l) + // k6
    scaled_weight_k7 * (f_k7_h + f_k7_l); // k7

  return [currentEstimate, poorEstimate];
};
