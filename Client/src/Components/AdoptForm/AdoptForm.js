import React, { useState } from "react";
import { useAuthContext } from "../../hooks/UseAuthContext";

function AdoptForm({ pet, closeForm }) {
  const { user } = useAuthContext();
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNo, setPhoneNo] = useState("");
  const [livingSituation, setLivingSituation] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [familyComposition, setFamilyComposition] = useState("");
  const [formError, setFormError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popupMessage, setPopupMessage] = useState(null);

  // Email validation function
  const isEmailValid = (email) => /^[a-zA-Z0-9._-]+@gmail\.com$/.test(email);

  // Phone number validation (basic check)
  const isPhoneValid = (phone) => /^[0-9]{10}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(false);
    setFormError("");

    if (!isEmailValid(email)) {
      setEmailError(true);
      return;
    }

    if (!isPhoneValid(phoneNo)) {
      setFormError("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!email || !phoneNo || !livingSituation || !previousExperience || !familyComposition) {
      setFormError("All fields are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("http://localhost:4000/form/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          email,
          phoneNo,
          livingSituation,
          previousExperience,
          familyComposition,
          petId: pet._id,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit form. Try again later.");
      
      setPopupMessage(`Adoption form for ${pet.name} submitted successfully! We’ll contact you soon.`);
    } catch (err) {
      setPopupMessage("Oops!... Connection Error. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="custom-adopt-form-container">
      <h2 className="custom-form-heading">Pet Adoption Application</h2>
      <div className="form-pet-container">
        <div className="pet-details">
          <div className="pet-pic">
            <img src={`http://localhost:4000/images/${pet.filename}`} alt={pet.name} />
          </div>
          <div className="pet-info">
            <h2>{pet.name}</h2>
            <p><b>Type:</b> {pet.type}</p>
            <p><b>Age:</b> {pet.age}</p>
            <p><b>Location:</b> {pet.location}</p>
          </div>
        </div>
        <div className="form-div">
          <form onSubmit={handleSubmit} className="custom-form">
            <div className="custom-input-box">
              <label className="custom-label">Email:</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="custom-input"
              />
              {emailError && <p className="error-message">Please provide a valid Gmail address.</p>}
            </div>
            <div className="custom-input-box">
              <label className="custom-label">Phone No.</label>
              <input
                type="text"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                className="custom-input"
              />
            </div>
            <div className="custom-input-box">
              <label className="custom-label">Pet Living Situation:</label>
              <input
                type="text"
                value={livingSituation}
                onChange={(e) => setLivingSituation(e.target.value)}
                className="custom-input"
              />
            </div>
            <div className="custom-input-box">
              <label className="custom-label">Previous Pet Experience:</label>
              <input
                type="text"
                value={previousExperience}
                onChange={(e) => setPreviousExperience(e.target.value)}
                className="custom-input"
              />
            </div>
            <div className="custom-input-box">
              <label className="custom-label">Any Other Pets:</label>
              <input
                type="text"
                value={familyComposition}
                onChange={(e) => setFamilyComposition(e.target.value)}
                className="custom-input"
              />
            </div>
            {formError && <p className="error-message">{formError}</p>}
            <button disabled={isSubmitting} type="submit" className="custom-cta-button custom-m-b">
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      {popupMessage && (
        <div className="popup">
          <div className="popup-content">
            <h4>{popupMessage}</h4>
          </div>
          <button
            onClick={() => {
              setPopupMessage(null);
              if (!popupMessage.includes("Error")) closeForm();
            }}
            className="close-btn"
          >
            Close <i className="fa fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default AdoptForm;
