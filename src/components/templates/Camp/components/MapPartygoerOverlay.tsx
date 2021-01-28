import React from "react";

import { WithId } from "utils/id";
import { User } from "types/User";

import UserProfilePicture from "components/molecules/UserProfilePicture";

interface MapPartygoerOverlayProps {
  partygoer: WithId<User>;

  venueId: string;
  myUserUid: string;
  totalRows: number;
  totalColumns: number;

  /** @default false **/
  withMiniAvatars?: boolean;

  setSelectedUserProfile: (user: WithId<User>) => void;
}

export const MapPartygoerOverlay: React.FC<MapPartygoerOverlayProps> = ({
  partygoer,

  venueId,
  myUserUid,
  totalRows,
  totalColumns,
  withMiniAvatars = false,

  setSelectedUserProfile,
}) => {
  const isMe = partygoer.id === myUserUid;
  const position = partygoer?.data?.[venueId];
  const currentRow = position?.row ?? 0;
  const currentCol = position?.column ?? 0;
  const avatarWidth = 100 / totalColumns;
  const avatarHeight = 100 / totalRows;

  const containerStyle = {
    display: "flex",
    width: `${avatarWidth}%`,
    height: `${avatarHeight}%`,
    position: "absolute",
    cursor: "pointer",
    transition: "all 1400ms cubic-bezier(0.23, 1 ,0.32, 1)",
    top: `${avatarHeight * (currentRow - 1)}%`,
    left: `${avatarWidth * (currentCol - 1)}%`,
    justifyContent: "center",
  };

  const avatarStyle = {
    width: "80%",
    height: "80%",
    borderRadius: "100%",
    alignSelf: "center",
    backgroundImage: `url(${partygoer?.pictureUrl})`,
    backgroundSize: "cover",
  };

  return (
    <UserProfilePicture
      user={partygoer}
      avatarClassName={`${isMe ? "me profile-avatar" : "profile-avatar"}`}
      containerStyle={containerStyle}
      avatarStyle={avatarStyle}
      setSelectedUserProfile={setSelectedUserProfile}
      miniAvatars={withMiniAvatars}
    />
  );
};
