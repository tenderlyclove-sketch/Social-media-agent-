export interface BrainResponse {
  success: boolean;
  reply: string;
  data?: any;
}

export function buildResponse(
  reply: string,
  data?: any
): BrainResponse {

  return {

    success: true,

    reply,

    data,

  };

}

export function buildError(
  message: string
): BrainResponse {

  return {

    success: false,

    reply: message,

  };

}