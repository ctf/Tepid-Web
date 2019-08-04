export function dbObjToSpreadable(a){
	return a.reduce((out, it)=>{out[it._id]=it;return out}, {})
}

export function dbObjToIds(a){
    return a.map(it=>it._id)
}