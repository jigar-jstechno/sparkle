import React from "react";
import { useForm } from "react-hook-form";
import { updateUserProfile } from "./helpers";
import "./Account.scss";
import getQueryParameters from "utils/getQueryParameters";
import { RouterLocation } from "types/RouterLocation";
import useConnectCurrentVenue from "hooks/useConnectCurrentVenue";
import { updateTheme } from "pages/VenuePage/helpers";
import { useUser } from "hooks/useUser";
import { useHistory } from "react-router-dom";
import { useSelector } from "hooks/useSelector";
import { venueInsideUrl } from "utils/url";
import { IS_BURN } from "secrets";

interface PropsType {
  location: RouterLocation;
}
export interface CodeOfConductFormData {
  contributeToExperience: string;
  cheerBand: string;
  greatNight: string;
  willingToImprovise: string;
  commonDecency: string;
  tenPrinciples: string;
  termsAndConditions: string;
  regionalBurn: string;
}

export interface CodeOfConductQuestion {
  name: keyof CodeOfConductFormData;
  text: string;
  link?: string;
}

const BURN_CODE_OF_CONDUCT_QUESTIONS: CodeOfConductQuestion[] = [
  {
    name: "commonDecency",
    text:
      "I will endeavor not to create indecent experiences or content, and understand my actions may be subject to review and possible disciplinary action",
  },
  {
    name: "tenPrinciples",
    text:
      "I agree to abide by the Ten Principles of Burning Man at the online burn",
    link: "https://burningman.org/culture/philosophical-center/10-principles/",
  },
  {
    name: "termsAndConditions",
    text: "I agree to SparkleVerse's Terms and Conditions",
    link: "https://sparklever.se/terms-and-conditions",
  },
];

const CodeOfConduct: React.FunctionComponent<PropsType> = ({ location }) => {
  useConnectCurrentVenue();

  const { user } = useUser();
  const { venue } = useSelector((state) => ({
    venue: state.firestore.data.currentVenue,
  }));
  const history = useHistory();
  const { venueId, returnUrl } = getQueryParameters(location.search);
  const { register, handleSubmit, errors, formState, watch } = useForm<
    CodeOfConductFormData
  >({
    mode: "onChange",
  });

  const proceed = () => {
    const url =
      user && venueId
        ? venueInsideUrl(venueId.toString())
        : returnUrl
        ? returnUrl.toString()
        : venueId?.toString() ?? "";
    history.push(url);
  };

  const onSubmit = async (data: CodeOfConductFormData) => {
    if (!user) return;
    await updateUserProfile(user.uid, data);
    proceed();
  };

  if (!venue) {
    return <>Loading...</>;
  }

  if (
    !venue.code_of_conduct_questions ||
    venue.code_of_conduct_questions.length === 0
  ) {
    proceed();
  }

  venue && updateTheme(venue);

  const codeOfConductQuestions = IS_BURN
    ? BURN_CODE_OF_CONDUCT_QUESTIONS
    : venue.code_of_conduct_questions;

  return (
    <div className="page-container code-of-conduct-container">
      <div className="kansas-smittys-logo"></div>
      <div className="login-container">
        <h2>Final step: agree to our code of conduct</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          {codeOfConductQuestions.map((q) => (
            <div className="input-group" key={q.name}>
              <label
                htmlFor={q.name}
                className={`checkbox ${watch(q.name) && "checkbox-checked"}`}
              >
                {q.link && (
                  <a href={q.link} target="_blank" rel="noopener noreferrer">
                    {q.text}
                  </a>
                )}
                {!q.link && q.text}
              </label>
              <input
                type="checkbox"
                name={q.name}
                id={q.name}
                ref={register({
                  required: true,
                })}
              />
              {/* @ts-ignore @debt questions should be typed if possible */}
              {q.name in errors && errors[q.name].type === "required" && (
                <span className="input-error">Required</span>
              )}
            </div>
          ))}

          <input
            className="btn btn-primary btn-block btn-centered"
            type="submit"
            value="Enter the event"
            disabled={!formState.isValid}
          />
        </form>
      </div>
    </div>
  );
};

export default CodeOfConduct;
