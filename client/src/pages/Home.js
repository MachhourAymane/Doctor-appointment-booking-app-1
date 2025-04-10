import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios
import Layout from "../components/Layout";
import { Col, Row } from "antd";
// import Doctor from "../components/Doctor"; // Remove this if unused
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";

function Home() {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        dispatch(showLoading());

        // Directly set the full URL here
        const response = await axios.get("http://localhost:5000/api/user/get-all-approved-doctors", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        dispatch(hideLoading());
        if (response.data.success) {
          setDoctors(response.data.data);
        }
      } catch (error) {
        dispatch(hideLoading());
      }
    };

    getData();
  }, []); // Empty dependency array, ensuring it runs only once

  // Styles for the Hero Section
  const heroSectionStyle = {
    textAlign: "center",
    margin: "40px 0",
    padding: "30px",
    backgroundColor: "#005555",
    color: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const heroTitleStyle = {
    fontSize: "2rem",
    marginBottom: "15px",
    fontWeight: "bold",
    letterSpacing: "1px",
  };

  const heroParagraphStyle = {
    fontSize: "1.2rem",
    marginBottom: "0",
    lineHeight: "1.6",
  };

  // Styles for the Services Section
  const servicesSectionStyle = {
    margin: "60px 0",
    textAlign: "center",
  };

  const servicesTitleStyle = {
    fontSize: "2.2rem",
    marginBottom: "40px",
    color: "#005555",
    fontWeight: "bold",
  };

  const serviceCardStyle = {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "25px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
  };

  const serviceCardHoverStyle = {
    transform: "translateY(-10px)",
    boxShadow: "0 8px 12px rgba(0, 0, 0, 0.15)",
  };

  const serviceIconStyle = {
    fontSize: "3.5rem",
    color: "#005555",
    marginBottom: "15px",
  };

  const serviceTitleStyle = {
    fontSize: "1.6rem",
    marginBottom: "10px",
    color: "#333",
    fontWeight: "bold",
  };

  const serviceDescriptionStyle = {
    fontSize: "1rem",
    color: "#666",
    lineHeight: "1.5",
  };

  // Styles for the Doctors Section
  const doctorsSectionStyle = {
    margin: "60px 0",
    textAlign: "center",
  };

  const doctorsTitleStyle = {
    fontSize: "2.2rem",
    marginBottom: "40px",
    color: "#005555",
    fontWeight: "bold",
  };

  const doctorCardStyle = {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    textAlign: "center",
  };

  const doctorCardHoverStyle = {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 12px rgba(0, 0, 0, 0.15)",
  };

  const doctorImageStyle = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "15px",
  };

  const doctorNameStyle = {
    fontSize: "1.4rem",
    marginBottom: "10px",
    color: "#333",
    fontWeight: "bold",
  };

  const doctorSpecialtyStyle = {
    fontSize: "1rem",
    color: "#666",
    lineHeight: "1.5",
  };

  // Services Data
  const services = [
    {
      title: "Telemedicine Consultations",
      description:
        "Connect with certified doctors online for virtual consultations. Get expert advice from the comfort of your home.",
      icon: "ri-video-chat-line",
    },
    {
      title: "In-Person Appointments",
      description:
        "Book appointments with specialists at nearby clinics or hospitals for comprehensive care.",
      icon: "ri-hospital-line",
    },
    {
      title: "24/7 Emergency Support",
      description:
        "Access round-the-clock medical assistance for urgent health concerns.",
      icon: "ri-emergency-line",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div style={heroSectionStyle}>
        <h1 style={heroTitleStyle}>Welcome to HealthCare+ </h1>
        <p style={heroParagraphStyle}>
          Your trusted partner for all healthcare needs. Connect with top-rated
          doctors and access medical services anytime, anywhere.
        </p>
      </div>

      {/* Services Section */}
      <div style={servicesSectionStyle}>
        <h2 style={servicesTitleStyle}>Our Services</h2>
        <Row gutter={[16, 16]}>
          {services.map((service, index) => (
            <Col key={index} xs={24} sm={12} lg={8}>
              <div
                style={{
                  ...serviceCardStyle,
                  ...(index === 0 && serviceCardHoverStyle), // Example hover effect
                }}
              >
                <i className={`${service.icon}`} style={serviceIconStyle}></i>
                <h3 style={serviceTitleStyle}>{service.title}</h3>
                <p style={serviceDescriptionStyle}>{service.description}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Doctors Section */}
      <div style={doctorsSectionStyle}>
        <h2 style={doctorsTitleStyle}>Meet Our Doctors</h2>
        <Row gutter={20}>
          {doctors.map((doctor) => (
            <Col span={8} xs={24} sm={24} lg={8} key={doctor._id}>
              <div
                style={{
                  ...doctorCardStyle,
                  ...(doctor._id === doctors[0]._id && doctorCardHoverStyle), // Example hover effect
                }}
              >
                <img
                  src={doctor.profilePicture}
                  alt={`${doctor.firstName} ${doctor.lastName}`}
                  style={doctorImageStyle}
                />
                <h3 style={doctorNameStyle}>
                  {doctor.firstName} {doctor.lastName}
                </h3>
                <p style={doctorSpecialtyStyle}>{doctor.specialization}</p>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Layout>
  );
}

export default Home;
