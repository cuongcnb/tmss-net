export interface Progress {
    advisorName: string;
    customerName: string;
    registerNo: string;
    state: string;
    text: string;
    img: string;
}

export interface Customers {
  list: Array<Progress>;
  total: number;
}

export interface TextSpeech {
  id?: string;
  text?: string;
  callDelay?: number;
}

export interface AudioData {
  audioContent: string;
}

export interface AudioRequest {
  input: {
    ssml: string
  };
  audioConfig: {
    audioEncoding: string,
    pitch: string
    speakingRate: string
  };
  voice: {
    languageCode: string,
    ssmlGender: string
  };
}
