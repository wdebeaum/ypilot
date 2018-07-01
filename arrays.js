// extend JS Array so that some arithmetic operators work on them

// concatenate arrays or add an element
Array.prototype.add = function(other) {
  if (Array.isArray(other)) {
    return this.concat(other);
  } else {
    return this.concat([other]);
  }
}

// remove element(s) from the array
Array.prototype.subtract = function(other) {
  if (Array.isArray(other)) {
    return this.filter(x => (!other.includes(x)));
  } else {
    return this.filter(x => (x != other));
  }
}

// concatenate a number of copies of the array
Array.prototype.scale = function(other) {
  if (Number.isInteger(other)) {
    var ret = new Array(this.length * other);
    for (var j = 0; j < other; j++) { 
      for (var i = 0; i < this.length; i++) {
	ret[j * this.length + i] = this[i];
      }
    }
    return ret;
  // TODO cartesian product when Array.isArray(other)?
  } else {
    throw new Error("Arrays can only be scaled by integers");
  }
}
