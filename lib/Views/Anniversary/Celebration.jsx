import React, { useState, useEffect } from "react";
import createReactClass from "create-react-class";
import PropTypes from "prop-types";
import classNames from "classnames";

import ObserveModelMixin from "terriajs/lib/ReactViews/ObserveModelMixin";
import knockout from "terriajs-cesium/Source/ThirdParty/knockout";

import Styles from "./celebration.scss";

import Streamers from "./Streamers.jsx";
import MailIcon from "./MailIcon.jsx";
import FeedbackIcon from "./FeedbackIcon.jsx";
import HatIcon from "./HatIcon.jsx";
import CloseButton from "./CloseButton.jsx";

import { useKeyPress } from "./useKeyPress.js";

const LOCAL_PROPERTY_KEY = "anniversaryPrompted";

const Celebration = createReactClass({
  displayName: "Celebration",
  mixins: [ObserveModelMixin],
  propTypes: {
    viewState: PropTypes.object.isRequired
  },
  componentWillMount() {
    this.props.viewState.showCelebration = false;
    knockout.track(this.props.viewState, ["showCelebration"]);
  },
  render() {
    const viewState = this.props.viewState || {};

    return (
      <CelebrationPure
        showCelebration={viewState.showCelebration}
        setShowCelebration={bool => {
          viewState.showCelebration = bool;
        }}
        viewState={this.props.viewState}
      />
    );
  }
});

export const CelebrationPure = ({
  showCelebration,
  setShowCelebration,
  viewState
}) => {
  const [celebrationVisible, setCelebrationVisible] = useState(true);
  const [celebrationIsAnimating, setCelebrationIsAnimating] = useState(false);

  useKeyPress("Escape", () => {
    if (showCelebration) {
      handleClose(false);
    }
  });

  // Listen to viewState's version of whether we show the modal
  useEffect(() => {
    if (showCelebration) {
      setCelebrationVisible(true);
    }
  }, [showCelebration]);

  // We need to make sure the component stays mounted while it's animating
  // but also disable the rest of the modal once it's finished
  useEffect(() => {
    if (celebrationIsAnimating) {
      setTimeout(() => {
        setCelebrationIsAnimating(false);
      }, 300);
    }
  }, [celebrationIsAnimating]);

  const handleClose = (persist = true) => {
    setCelebrationIsAnimating(true);
    setCelebrationVisible(false);
    setTimeout(() => {
      // Ensures next open of it starts from the correct beginning frame
      setCelebrationVisible(true);
      setShowCelebration(false);
    }, 300);
  };

  return (
    <>
      <If condition={showCelebration || celebrationIsAnimating}>
        <div
          className={classNames({
            [Styles.popupModalWrapper]: true,
            [Styles.popupModalWrapperClosing]: !celebrationVisible
          })}
          onClick={handleClose.bind(null, false)}
        >
          <article
            className={Styles.popupModal}
            style={{
              backgroundImage: `url(${require("../../../wwwroot/images/anniversary-bg.jpg")})`
            }}
            // Allows interaction w/ modal without closing
            onClick={e => e.stopPropagation()}
          >
            <span className={Styles.streamersWrapper}>
              <Streamers
                alt="Anniversary Streamers"
                className={Styles.streamers}
              />
            </span>
            <CloseButton onClick={handleClose.bind(null, false)} />
            <h1>
              <HatIcon
                className={Styles.hat}
                role="presentation"
                aria-hidden="true"
              />
              NationalMap has turned 5!
            </h1>
            <span className={Styles.popupModalBody}>
              <p>
                We’re looking for great stories.
                <br />
                Help us tell yours!
              </p>
              <span className={Styles.popupModalQuestions}>
                <p>
                  What impact has NationalMap had on you?
                  <br />
                  What changes would you like to see?
                </p>
              </span>
              <a
                href={`mailto:info@terria.io?subject=National Map Anniversary Feedback&body=What%20impact%20has%20NationalMap%20had%20on%20you%3F%0A%0AWhat%20changes%20would%20you%20like%20to%20see%3F`}
                className={Styles.popupModalButton}
                title="Send us a birthday email!"
              >
                <MailIcon
                  className={Styles.popupModalButtonIcon}
                  role="presentation"
                  aria-hidden="true"
                />
                Send us a birthday email
              </a>
              <button
                className={Styles.popupModalButton}
                onClick={() => {
                  handleClose(true);
                  setTimeout(() => {
                    viewState.feedbackFormIsVisible = true;
                  }, 300);
                }}
              >
                <FeedbackIcon
                  className={Styles.popupModalButtonIcon}
                  role="presentation"
                  aria-hidden="true"
                />
                Leave feedback
              </button>
              <p>
                <button
                  className={Styles.popupModalCloseLink}
                  onClick={handleClose.bind(null, false)}
                >
                  Maybe later
                </button>{" "}
              </p>
            </span>
            <footer className={Styles.popupModalFooter}>
              Be gentle, we read all of your comments (thank you!)
            </footer>
          </article>
        </div>
      </If>
    </>
  );
};

CelebrationPure.propTypes = {
  showCelebration: PropTypes.bool.isRequired,
  setShowCelebration: PropTypes.func.isRequired,
  viewState: PropTypes.object.isRequired
};

export default Celebration;
