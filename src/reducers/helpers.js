export const dbObjToSpreadable = (a) => a.reduce((out, it) => {out[it._id]=it; return out}, {});
export const dbObjToIds = (a) => a.map(it => it._id);
