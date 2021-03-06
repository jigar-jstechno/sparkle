import React, { useEffect, useMemo, useRef, useState } from "react";
import { isEqual } from "lodash";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { updateRoom, updateVenue_v2 } from "api/admin";

import { useUser } from "hooks/useUser";

import {
  Container,
  SubVenueIconMap,
} from "pages/Account/Venue/VenueMapEdition/Container";
import Legend from "components/atoms/Legend";
import * as S from "./MapPreview.styles";
import BackgroundSelect from "../BackgroundSelect";
import { MapPreviewProps } from "./MapPreview.types";
import { RoomData_v2 } from "types/rooms";

const MapPreview: React.FC<MapPreviewProps> = ({
  venueName,
  mapBackground,
  rooms,
  venueId,
  isEditing,
  setIsEditing,
}) => {
  const { user } = useUser();
  const [mapRooms, setMapRooms] = useState<RoomData_v2[]>([]);

  useEffect(() => {
    if (
      !mapRooms.length ||
      !isEqual(rooms.length, mapRooms.length) ||
      !isEditing
    ) {
      setMapRooms(rooms);
    }
  }, [isEditing, mapRooms, rooms]);

  const roomRef = useRef<SubVenueIconMap>({});

  const iconsMap = useMemo(() => {
    const iconsRooms = isEditing || mapRooms.length ? mapRooms : rooms;
    return iconsRooms.map((room, index: number) => ({
      width: room.width_percent,
      height: room.height_percent,
      top: room.y_percent,
      left: room.x_percent,
      url: room.image_url,
      roomIndex: index,
    }));
  }, [isEditing, mapRooms, rooms]);

  if (!user) return <></>;

  const handleOnChange = (val: SubVenueIconMap) => {
    if (!isEqual(roomRef.current, val)) {
      roomRef.current = val;
      const normalizeRooms = Object.values(val).map((room, index) => ({
        ...rooms[index],
        x_percent: room.left,
        y_percent: room.top,
        width_percent: room.width,
        height_percent: room.height,
      }));
      setMapRooms(normalizeRooms);
    }
  };

  const handleSavePositions = async () => {
    const roomArr = Object.values(roomRef.current);

    let roomIndex = 0;

    for (const r of roomArr) {
      const room = {
        ...rooms[roomIndex],
        x_percent: r.left,
        y_percent: r.top,
        width_percent: r.width,
        height_percent: r.height,
      };

      await updateRoom(room, venueId, user, roomIndex);
      roomIndex++;
    }

    setIsEditing(false);
  };

  const handleBackgroundRemove = () => {
    if (!user) return;

    return updateVenue_v2(
      {
        name: venueName,
        mapBackgroundImageUrl: "",
      },
      user
    );
  };

  const handleEditButton = async () => {
    if (isEditing) {
      return await handleSavePositions();
    }

    return setIsEditing(true);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <S.Wrapper>
        <Legend text={`${venueName}'s Map`} />

        {!!mapBackground && (
          <Legend
            text="Edit background"
            position="right"
            onClick={() => handleBackgroundRemove()}
          />
        )}

        {!isEditing && (
          <BackgroundSelect
            venueName={venueName}
            mapBackground={mapBackground}
          />
        )}

        {mapBackground &&
          !isEditing &&
          mapRooms.map((room) => (
            <div
              key={room.title}
              style={{
                position: "absolute",
                top: `${room.y_percent}%`,
                left: `${room.x_percent}%`,
                width: `${room.width_percent}%`,
                height: `${room.height_percent}%`,
              }}
            >
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  filter: room.isEnabled ? "none" : "grayscale(100%)",
                  opacity: room.isEnabled ? 1 : 0.5,
                  transition: "filter .3s ease",
                }}
                src={room.image_url}
                alt="room banner"
                title={room.title}
              />
            </div>
          ))}

        {mapBackground && isEditing && (
          <Container
            interactive
            resizable
            onChange={handleOnChange}
            backgroundImage={mapBackground}
            otherIcons={{}}
            // @ts-ignore
            iconsMap={iconsMap}
            coordinatesBoundary={{
              width: 100,
              height: 100,
            }}
            otherIconsStyle={{ opacity: 0.4 }}
            // lockAspectRatio
          />
        )}

        <S.EditButton onClick={handleEditButton}>
          {isEditing ? "Save layout" : "Edit layout"}
        </S.EditButton>
      </S.Wrapper>
    </DndProvider>
  );
};

export default MapPreview;
