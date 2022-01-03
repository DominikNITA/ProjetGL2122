class NotImplementedError extends Error {
  constructor() {
    super('Not implemented functionality!');
    Object.setPrototypeOf(this, NotImplementedError.prototype);
  }
}

class InvalidParameterValue extends Error {
  constructor(parameter: any, reason: string) {
    super(
      `Invalid parameter '${
        Object.keys({ parameter })[0]
      }' => ${parameter}. Reason: ${reason}`
    );
    Object.setPrototypeOf(this, NotImplementedError.prototype);
  }
}

export { NotImplementedError, InvalidParameterValue };
