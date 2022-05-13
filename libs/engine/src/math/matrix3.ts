// Update this class to take an unput matrix for all operations
// Input will have changes applied to it to avoid creating new matrices
export class Matrix3 {

  static multiply(a: Float32Array, b: Float32Array): Float32Array {
    const a00 = a[0 * 3 + 0];
    const a01 = a[0 * 3 + 1];
    const a02 = a[0 * 3 + 2];
    const a10 = a[1 * 3 + 0];
    const a11 = a[1 * 3 + 1];
    const a12 = a[1 * 3 + 2];
    const a20 = a[2 * 3 + 0];
    const a21 = a[2 * 3 + 1];
    const a22 = a[2 * 3 + 2];
    const b00 = b[0 * 3 + 0];
    const b01 = b[0 * 3 + 1];
    const b02 = b[0 * 3 + 2];
    const b10 = b[1 * 3 + 0];
    const b11 = b[1 * 3 + 1];
    const b12 = b[1 * 3 + 2];
    const b20 = b[2 * 3 + 0];
    const b21 = b[2 * 3 + 1];
    const b22 = b[2 * 3 + 2];

    return new Float32Array([
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ]);
  };

  static translation(tx: number, ty: number): Float32Array {
    return new Float32Array([
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1,
    ]);
  };

  static rotation(angleInRadians: number): Float32Array {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    return new Float32Array([
      c, -s, 0,
      s, c, 0,
      0, 0, 1,
    ]);
  }

  static scaling(sx: number, sy: number): Float32Array {
    return new Float32Array([
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1,
    ]);
  }

  static projection(width: number, height: number): Float32Array {
    // Note: This matrix flips the Y axis so that 0 is at the top.
    return new Float32Array([
      2 / width, 0, 0,
      0, -2 / height, 0,
      -1, 1, 1,
    ]);
  }

  static copy(src: Float32Array, dst: Float32Array): void {
    dst[0] = src[0];
    dst[1] = src[1];
    dst[2] = src[2];
    dst[3] = src[3];
    dst[4] = src[4];
    dst[5] = src[5];
    dst[6] = src[6];
    dst[7] = src[7];
    dst[8] = src[8];
    dst[9] = src[9];
  }

  static identity(): Float32Array {
    return new Float32Array([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ]);
  }
}