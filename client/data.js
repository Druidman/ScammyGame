
export const START_SCREEN = "START_SCREEN"
export const GAME_WAITER_SCREEN = "GAME_WAITER_SCREEN"
export const CHAT_BOX_SCREEN = "CHAT_BOX_SCREEN"
export const GAME_BOX_SCREEN = "GAME_BOX_SCREEN"
export const GAME_END_SCREEN = "GAME_END_SCREEN"


export const CONNECTION_MSG_TYPE = "CONNECTION";
export const CONNECTION_MSG = (val) => ({
    MSG_TYPE: CONNECTION_MSG_TYPE,
    VALUE: val
});

export const GAME_ASSIGNED_MSG_TYPE = "GAME_ASSIGNED";
export const GAME_ASSIGNED_MSG = (val) => ({
    MSG_TYPE: GAME_ASSIGNED_MSG_TYPE,
    VALUE: val
});

export const STATUS_MSG_TYPE = "STATUS";
export const STATUS_MSG = (val) => ({
    MSG_TYPE: STATUS_MSG_TYPE,
    VALUE: val
});

export const REQUEST_STATUS_MSG_TYPE = "REQUEST_STATUS";
export const REQUEST_STATUS_MSG = {
    MSG_TYPE: REQUEST_STATUS_MSG_TYPE,
    VALUE: true
};

export const DISCONNECT_MSG_TYPE = "DISCONNECT";
export const DISCONNECT_MSG = {
    MSG_TYPE: DISCONNECT_MSG_TYPE,
    VALUE: true
};

export const START_CHATTING_PHASE_MSG_TYPE = "START_CHATTING_PHASE";
export const START_CHATTING_PHASE_MSG = {
    MSG_TYPE: START_CHATTING_PHASE_MSG_TYPE,
    VALUE: true
};

export const END_CHATTING_PHASE_MSG_TYPE = "END_CHATTING_PHASE";
export const END_CHATTING_PHASE_MSG = {
    MSG_TYPE: END_CHATTING_PHASE_MSG_TYPE,
    VALUE: true
};

export const CHAT_MSG_TYPE = "CHAT_MSG";
export const CHAT_MSG = (val) => ({
    MSG_TYPE: CHAT_MSG_TYPE,
    VALUE: val
});

export const NONE_MSG_TYPE = "NONE";
export const NONE_MSG = {
    MSG_TYPE: NONE_MSG_TYPE,
    VALUE: ""
};

export const ADD_COINS_MSG_TYPE = "ADD_COINS_MSG_TYPE";
export const ADD_COINS_MSG = (val) => ({
    MSG_TYPE: ADD_COINS_MSG_TYPE,
    VALUE: val
});

export const REMOVE_COINS_MSG_TYPE = "REMOVE_COINS_MSG_TYPE";
export const REMOVE_COINS_MSG = (val) => ({
    MSG_TYPE: REMOVE_COINS_MSG_TYPE,
    VALUE: val
});

export const ROUND_START_MSG_TYPE = "ROUND_START_MSG_TYPE";
export const ROUND_START_MSG = {
    MSG_TYPE: ROUND_START_MSG_TYPE,
    VALUE: true
};

export const ROUND_END_MSG_TYPE = "ROUND_END_MSG_TYPE";
export const ROUND_END_MSG = {
    MSG_TYPE: ROUND_END_MSG_TYPE,
    VALUE: true
};

export const GAME_QUESTION_MSG_TYPE = "GAME_QUESTION_MSG_TYPE";
export const GAME_QUESTION_MSG = (question, operation) => ({
    MSG_TYPE: GAME_QUESTION_MSG_TYPE,
    VALUE: {
        QUESTION: question,
        OPERATION: operation // lie or truth
    }
});

export const GAME_QUESTION_REPLY_TYPE = "GAME_QUESTION_REPLY_TYPE";
export const GAME_QUESTION_REPLY = (val) => ({
    MSG_TYPE: GAME_QUESTION_REPLY_TYPE,
    VALUE: val
});

export const GAME_QUESTION_VERIFY_TYPE = "GAME_QUESTION_VERIFY_TYPE";
export const GAME_QUESTION_VERIFY = (question, answer) => ({
    MSG_TYPE: GAME_QUESTION_VERIFY_TYPE,
    VALUE: {
        QUESTION: question,
        ANSWER: answer
    }
});

export const GAME_QUESTION_VERIFY_REPLY_TYPE = "GAME_QUESTION_VERIFY_REPLY_TYPE";
export const GAME_QUESTION_VERIFY_REPLY = (val) => ({
    MSG_TYPE: GAME_QUESTION_VERIFY_REPLY_TYPE,
    VALUE: val
});

export const PLAYER_WON_MSG_TYPE = "PLAYER_WON_MSG_TYPE"
export const PLAYER_WON_MSG = {
    MSG_TYPE: PLAYER_WON_MSG_TYPE,
    VALUE: true
}

export const PLAYER_LOST_MSG_TYPE = "PLAYER_LOST_MSG_TYPE"
export const PLAYER_LOST_MSG = {
    MSG_TYPE: PLAYER_LOST_MSG_TYPE,
    VALUE: true
}

export const GAME_TIE_MSG_TYPE = "GAME_TIE_MSG_TYPE"
export const GAME_TIE_MSG = {
    MSG_TYPE: GAME_TIE_MSG_TYPE,
    VALUE: true
}

export const GAME_SUMMARY_MSG_TYPE = "GAME_SUMMARY_MSG_TYPE"
export const GAME_SUMMARY_MSG = {
    MSG_TYPE: GAME_SUMMARY_MSG_TYPE,
    VALUE: true
}
