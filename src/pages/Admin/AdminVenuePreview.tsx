import React, { CSSProperties, useMemo } from "react";
import { Venue } from "types/Venue";
import { WithId } from "utils/id";
import { VenueTemplate } from "types/VenueTemplate";
import { useQuery } from "hooks/useQuery";
import { isCampVenue } from "types/CampVenue";

interface AdminVenuePreview {
  venue: WithId<Venue>;
  containerStyle: CSSProperties;
}

export const AdminVenuePreview: React.FC<AdminVenuePreview> = ({
  venue,
  containerStyle,
}) => {
  const queryParams = useQuery();
  const queryRoomIndexString = queryParams.get("roomIndex");
  const queryRoomIndex = queryRoomIndexString
    ? parseInt(queryRoomIndexString)
    : undefined;

  const room =
    isCampVenue(venue) && typeof queryRoomIndex !== "undefined"
      ? venue.rooms[queryRoomIndex]
      : undefined;

  const templateSpecificListItems = useMemo(() => {
    switch (venue.template) {
      case VenueTemplate.artpiece:
        return (
          <div>
            <span className="title">iFrame URL</span>
            <span className="content">
              <a href={venue.embedIframeUrl}>{venue.embedIframeUrl}</a>
            </span>
          </div>
        );
      case VenueTemplate.zoomroom:
        return (
          <div>
            <span className="title">Zoom URL</span>
            <span className="content">
              <a href={venue.zoomUrl} target="_blank" rel="noopener noreferrer">
                {venue.zoomUrl}
              </a>
            </span>
          </div>
        );
      default:
        return;
    }
  }, [venue]);

  return (
    <div style={containerStyle}>
      <div className="venue-preview">
        <h4
          className="italic"
          style={{ textAlign: "center", fontSize: "30px" }}
        >
          Experience Info: {venue.name}
        </h4>
        <div className="heading-group">
          <div style={{ padding: "5px" }}>
            <span className="title" style={{ fontSize: "18px" }}>
              Name:
            </span>
            <span className="content">{venue.name}</span>
          </div>
          <div style={{ padding: "5px" }}>
            <span className="title" style={{ fontSize: "18px" }}>
              Short description:
            </span>
            <span className="content">
              {venue.config.landingPageConfig.subtitle}
            </span>
          </div>
          <div style={{ padding: "5px" }}>
            <span className="title" style={{ fontSize: "18px" }}>
              Long description:
            </span>
            <span className="content">
              {venue.config.landingPageConfig.description}
            </span>
          </div>
        </div>
        <div className="content-group" style={{ display: "flex" }}>
          <div style={{ width: "150px" }}>
            <div className="title" style={{ width: "150px" }}>
              Banner photo
            </div>
            <div className="content">
              <img
                className="icon"
                src={
                  venue.config.landingPageConfig.bannerImageUrl ??
                  venue.config.landingPageConfig.coverImageUrl
                }
                alt="icon"
              />
            </div>
          </div>
          <div style={{ width: "150px" }}>
            <div className="title" style={{ width: "150px" }}>
              Playa icon
            </div>
            <div className="content">
              <img className="icon" src={venue.mapIconImageUrl} alt="icon" />
            </div>
          </div>
          <div style={{ width: "150px" }}>
            <div className="title" style={{ width: "150px" }}>
              Camp logo
            </div>
            <div className="content">
              <img className="icon" src={venue.host.icon} alt="icon" />
            </div>
          </div>
        </div>
        <div className="content-group" style={{ padding: "5px" }}>
          <span className="title" style={{ fontSize: "20px" }}>
            This is a preview of your camp
          </span>
          <img
            className="banner"
            src={venue.mapBackgroundImageUrl}
            alt="cover"
          />
        </div>
        {templateSpecificListItems}
      </div>
      {room && (
        <div className="venue-preview">
          <div>
            <h4
              className="italic"
              style={{ textAlign: "center", fontSize: "30px" }}
            >
              Room Info: {room.title}
            </h4>
            <small>
              You can select other rooms in {venue.name} from the menu on the
              left.
            </small>
            <div className="heading-group">
              <div style={{ padding: "5px" }}>
                <span className="title" style={{ fontSize: "18px" }}>
                  title:
                </span>
                <span className="content">{room.title}</span>
              </div>
              <div style={{ padding: "5px" }}>
                <span className="title" style={{ fontSize: "18px" }}>
                  subtitle:
                </span>
                <span className="content">{room.subtitle}</span>
              </div>
              <div style={{ padding: "5px" }}>
                <span className="title" style={{ fontSize: "18px" }}>
                  About:
                </span>
                <span className="content">{room.about}</span>
              </div>
              <div style={{ padding: "5px" }}>
                <span className="title" style={{ fontSize: "18px" }}>
                  URL:
                </span>
                <span className="content">
                  <a href={room.url}>{room.url}</a>
                </span>
              </div>
            </div>
            <div className="content-group">
              <div style={{ width: "250px" }}>
                <div
                  className="title"
                  style={{ fontSize: "20px", width: "250px" }}
                >
                  How your room will appear on the camp map
                </div>
                <img
                  className="banner"
                  src={room.image_url}
                  alt="room icon"
                  style={{ height: "300px", width: "300px" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};