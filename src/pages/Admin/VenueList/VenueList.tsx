import React from "react";
import { Link } from "react-router-dom";

// Hooks
import { useSelector } from "hooks/useSelector";

// Typings
import { VenueListProps } from "./VenueList.types";
import { canHaveSubvenues } from "utils/venue";
import { isCampVenue } from "types/CampVenue";

const VenueList: React.FC<VenueListProps> = ({
  selectedVenueId,
  roomIndex,
}) => {
  const venues = useSelector((state) => state.firestore.ordered.venues);

  if (!venues) return <>Loading...</>;

  return (
    <>
      <div className="page-container-adminsidebar-title title">My Venues</div>
      <div className="page-container-adminsidebar-top">
        <Link to="/admin_v2/venue/creation" className="btn btn-primary">
          Create a venue
        </Link>
      </div>
      <ul className="page-container-adminsidebar-venueslist">
        {venues.map((venue, index) => (
          <li
            key={index}
            className={`${selectedVenueId === venue.id ? "selected" : ""} ${
              canHaveSubvenues(venue) ? "camp" : ""
            }`}
          >
            <Link to={`/admin_v2/venue/${venue.id}`}>{venue.name}</Link>
            {isCampVenue(venue) && (
              <ul className="page-container-adminsidebar-subvenueslist">
                {venue.rooms.map((room, idx) => (
                  <li
                    key={idx}
                    className={`${idx === roomIndex ? "selected" : ""}`}
                  >
                    <Link to={`/admin_v2/venue/${venue.id}?roomIndex=${idx}`}>
                      {room.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default VenueList;
