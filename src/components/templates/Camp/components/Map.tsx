import React, { useState } from "react";
import { CampVenue } from "types/CampVenue";
import { CampRoomData } from "types/CampRoomData";
import "./Map.scss";
import { IS_BURN } from "secrets";
import { RoomVisibility } from "types/Venue";
import { enterRoom } from "../../../../utils/useLocationUpdateEffect";
import { useUser } from "../../../../hooks/useUser";

interface PropsType {
  venue: CampVenue;
  attendances: { [location: string]: number };
  setSelectedRoom: (room: CampRoomData) => void;
  setIsRoomModalOpen: (value: boolean) => void;
}

export const Map: React.FC<PropsType> = ({
  venue,
  attendances,
  setSelectedRoom,
  setIsRoomModalOpen,
}) => {
  const { user } = useUser();
  const [roomClicked, setRoomClicked] = useState<string | undefined>(undefined);
  const [roomHovered, setRoomHovered] = useState<CampRoomData | undefined>(
    undefined
  );

  if (!venue) {
    return <>Loading map...</>;
  }

  const rooms = [...venue.rooms];

  if (roomHovered) {
    const idx = rooms.findIndex((room) => room.title === roomHovered.title);
    if (idx !== -1) {
      const chosenRoom = rooms.splice(idx, 1);
      rooms.push(chosenRoom[0]);
    }
  }

  const getRoomUrl = (roomUrl: string) => {
    return roomUrl.includes("http") ? roomUrl : `//${roomUrl}`;
  };

  const isExternalLink = (url: string) =>
    url.includes("http") &&
    new URL(window.location.href).host !== new URL(getRoomUrl(url)).host;

  const roomEnter = (room: CampRoomData) => {
    room && user && enterRoom(user, room.title);
  };
  const openModal = (room: CampRoomData) => {
    setSelectedRoom(room);
    setIsRoomModalOpen(true);
  };

  return (
    <>
      <div id="map" className="col map-container">
        {rooms.map((room) => {
          const left = room.x_percent;
          const top = room.y_percent;
          const width = room.width_percent;
          const height = room.height_percent;
          return (
            <div
              className="room position-absolute"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${width}%`,
                height: `${height}%`,
              }}
              key={room.title}
              onClick={() => {
                if (!IS_BURN) {
                  openModal(room);
                } else {
                  setRoomClicked((prevRoomClicked) =>
                    prevRoomClicked === room.title ? undefined : room.title
                  );
                }
              }}
              onMouseEnter={() => {
                setRoomHovered(room);
              }}
              onMouseLeave={() => {
                setRoomHovered(undefined);
              }}
            >
              <div
                className={`playa-venue ${
                  roomClicked === room.title ? "clicked" : ""
                }`}
              >
                <div className="playa-venue-img">
                  <img
                    src={room.image_url}
                    title={room.title}
                    alt={room.title}
                  />
                </div>
                {venue.roomVisibility === RoomVisibility.nameCount &&
                  roomHovered &&
                  roomHovered.title === room.title && (
                    <div className="playa-venue-text">
                      <div className="playa-venue-maininfo">
                        <div className="playa-venue-title">{room.title}</div>

                        {(attendances[room.title] ?? 0) +
                          (room.attendanceBoost ?? 0) >
                          0 && (
                          <div className="playa-venue-people">
                            {(attendances[room.title] ?? 0) +
                              (room.attendanceBoost ?? 0)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                <div className="playa-venue-text">
                  {(!venue.roomVisibility ||
                    venue.roomVisibility === RoomVisibility.nameCount ||
                    venue.roomVisibility === RoomVisibility.count) && (
                    <div className="playa-venue-maininfo">
                      {(!venue.roomVisibility ||
                        venue.roomVisibility === RoomVisibility.nameCount) && (
                        <div className="playa-venue-title">{room.title}</div>
                      )}

                      {(attendances[room.title] ?? 0) +
                        (room.attendanceBoost ?? 0) >
                        0 && (
                        <div className="playa-venue-people">
                          {(attendances[room.title] ?? 0) +
                            (room.attendanceBoost ?? 0)}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="playa-venue-secondinfo">
                    <div className="playa-venue-desc">
                      <p>{room.subtitle}</p>
                      <p>{room.about}</p>
                    </div>
                    <div className="playa-venue-actions">
                      {isExternalLink(room.url) ? (
                        <a
                          className="btn btn-block btn-small btn-primary"
                          onClick={() => roomEnter(room)}
                          href={getRoomUrl(room.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {venue.joinButtonText ?? "Join the room"}
                        </a>
                      ) : (
                        <a
                          className="btn btn-block btn-small btn-primary"
                          onClick={() => roomEnter(room)}
                          href={getRoomUrl(room.url)}
                        >
                          {venue.joinButtonText ?? "Join the room"}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <img
          className="img-fluid map-image"
          src={venue.mapBackgroundImageUrl}
          title="Clickable Map"
          alt="Clickable Map"
        />
      </div>
    </>
  );
};
