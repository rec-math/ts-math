import { numerical } from '../../esm/index.js';

const { quad } = numerical;

/**
|:  z :|: pbuk GK(5,17)    :|: Ibix           :|
-------|--------------------|-------------------
 0.1,  | 1.409699537167435  | 1.409699537167435
 0.09, | 1.2718364599617438 | 1.2718364599617440
 0.08, | 1.133275788110779  | 1.133275788110779
 0.07, | 0.9940198604891496 | 0.9940198604891496
 0.06, | 0.8540712154740807 | 0.8540712154740808
 0.05, | 0.7134325928253945 | 0.7134325928253945
 0.04, | 0.5721069353785664 | 0.5721069353785664
 0.03, | 0.4300973905418237 | 0.4300973905418238
 0.02, | 0.2874073115884052 | 0.2874073115884052
 0.01, | 0.1440402587352972 | 0.1440402587352972
 0.00, | 0                  | 0
-0.01, | 0.1447094881728547 | 0.1447094881728547
-0.02, | 0.2900840205228997 | 0.2900840205228997
-0.03, | 0.43611920283095357| 0.43611920283095362
-0.04, | 0.5828104320285897 | 0.5828104320285896
-0.05, | 0.7301528965670419 | 0.7301528965670417
-0.06, | 0.8781415770516691 | 0.8781415770516691
-0.07, | 1.0267712471476862 | 1.0267712471476862
-0.08, | 1.1760364747623278 | 1.1760364747623280
-0.09, | 1.3259316235080325 | 1.3259316235080327
-0.10, | 1.4764508544505859 | 1.4764508544505859
 */
// Various constants
const rhoConst = 1.7885e9; // 3 / (8 pi G)
const secInGy = 3.1536e16; // s / Gyr
const tempNow = 2.725; // CMB temperature now
const Hconv = 1 / 978; // Convert km/s/Mpc -> Gyr^-1

// Inputs (Planck 2015, copied from Jorrie's calculator
let H0 = 67.74; // H0 control
const OmegaL = 0.691; // OmegaL control
const Omega = 1; // Omega control
const z_eq = 3370; // z_eq control

/*
const zvals = [
  // The z values copied from Lightcone7's table for cross-checking.
  1089.999, 339.0316542, 104.9771906, 32.02928913, 9.293570928, 2.207515378, 0,
  -0.6893293728, -0.8690917659, -0.9451725312, -0.9773721629, -0.991,
];
*/

const zvals = [
  // Positive.
  0.1,
  0.09,
  0.08,
  0.07,
  0.06,
  0.05,
  0.04,
  0.03,
  0.02,
  0.01,
  0, // Zero.
  // Negative.
  -0.01,
  -0.02,
  -0.03,
  -0.04,
  -0.05,
  -0.06,
  -0.07,
  -0.08,
  -0.09,
  -0.1,
];

// Constants derived from inputs
H0 *= Hconv; // # H0 in Gyr^-1
// const rhocritNow = rhoConst * (H0 / secInGy) ** 2; //     # Critical density now
const s_eq = 1 + z_eq; //   # Stretch when OmegaM=OmegaR
const OmegaM = ((Omega - OmegaL) * s_eq) / (s_eq + 1); // # Energy density of matter
const OmegaR = OmegaM / s_eq; // # Energy density of radiation
const OmegaK = 1 - OmegaM - OmegaR - OmegaL; // # Curvature energy density

const H = (s) => {
  // """Hubble constant as a function of stretch, s = 1/a, where a is the
  // usual FLRW scale factor"""
  return (
    H0 * Math.sqrt(OmegaL + OmegaK * s ** 2 + OmegaM * s ** 3 + OmegaR * s ** 4)
  );
};

const TH = (s) => 1 / H(s);
const THs = (s) => TH(s) / s;

const output = (vals) => {
  console.log(vals);
};

const infty = Infinity;

zvals.forEach((z) => {
  const s = 1 + z;
  // s = 1.001 + z  // Uncomment to replicate a systematic bug in Lightcone7
  const a = 1 / s;
  const Tnow = quad(THs, [s, infty])[0];
  const R = 1 / H(s);
  const Dnow = Math.abs(quad(TH, [1, s])[0]);
  const Dthen = Dnow / s;
  const Dhor = quad(TH, [0, s])[0] / s;
  const Dpar = quad(TH, [s, infty])[0] / s;
  const Vgen = H(s) / (H0 * s);
  const Vnow = Dnow * H0;
  const Vthen = Dthen * H(s);
  const Temp = tempNow * s;
  const rhocrit = rhoConst * (H(s) / secInGy) ** 2;
  const OmegaMT = (Omega - OmegaL) * s ** 3 * (H0 / H(s)) ** 2;
  const OmegaLT = (H0 / H(s)) ** 2 * OmegaL;
  const OmegaRT = (OmegaMT * s) / s_eq;
  const OmegaTT = OmegaMT + OmegaLT + OmegaRT;
  output({
    z,
    a,
    s,
    // Metrics.
    Tnow,
    R,
    Dnow,
    Dthen,
    Dhor,
    Dpar,
    Vgen,
    Vnow,
    Vthen,
    // ???
    H_sOverHconv: H(s) / Hconv,
    // Others.
    Temp,
    rhocrit,
    OmegaMT,
    OmegaLT,
    OmegaRT,
    OmegaTT,
  });
});
