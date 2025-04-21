import { UUID } from "crypto";

type SessionPayload = {
    id: UUID;
    expiresAt: Date;
};

export default SessionPayload;
