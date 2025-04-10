import React, { useEffect, useState } from "react";
import { Button, Col, DatePicker, Row, TimePicker, Skeleton } from "antd"; // Import Skeleton for placeholder
import Layout from "../components/Layout"; // Ensure this component renders its children properly
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

function BookAppointment() {
  const [isAvailable, setIsAvailable] = useState(false);
  const navigate = useNavigate();
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const params = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const getDoctorData = async () => {
      try {
        if (!params.doctorId) {
          console.error("No doctor ID provided in URL parameters.");
          setLoading(false); // Stop loading if no doctor ID
          return;
        }

        dispatch(showLoading());
        console.log("Fetching doctor data for ID:", params.doctorId); // Debug log
        const response = await axios.post(
          "http://localhost:5000/api/doctor/get-doctor-info-by-id",
          {
            doctorId: params.doctorId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        dispatch(hideLoading());
        if (response.data.success) {
          console.log("Doctor data fetched:", response.data.data); // Debug log
          setDoctor(response.data.data);
        } else {
          console.error("Failed to fetch doctor data:", response.data.message);
          toast.error("Failed to load doctor information.");
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        dispatch(hideLoading());
        toast.error("An error occurred while fetching doctor data.");
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    getDoctorData();
  }, [params.doctorId, dispatch]);

  const checkAvailability = async () => {
    if (!date || !time) {
      toast.error("Please select a date and time.");
      return;
    }

    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/api/user/check-booking-availability",
        {
          doctorId: params.doctorId,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      toast.error("Error checking appointment availability.");
      dispatch(hideLoading());
    }
  };

  const bookNow = async () => {
    if (!date || !time) {
      toast.error("Please select a date and time.");
      return;
    }

    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:5000/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/appointments");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Error booking appointment.");
      dispatch(hideLoading());
    }
  };

  return (
    <Layout>
      {/* Show loading placeholder if data is still being fetched */}
      {loading ? (
        <div style={{ padding: "20px" }}>
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      ) : (
        <div>
          {/* Page Title */}
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: "bold",
              textAlign: "center",
              color: "#005555",
              margin: "30px 0",
            }}
          >
            {doctor?.firstName && doctor?.lastName
              ? `${doctor.firstName} ${doctor.lastName}`
              : "Doctor Information Unavailable"}
          </h1>
          <hr />

          {/* Doctor Details Section */}
          <Row gutter={20} style={{ marginTop: "40px", alignItems: "center" }}>
            {/* Image Column */}
            <Col span={8} sm={24} xs={24} lg={8}>
              <img
                src="https://thumbs.dreamstime.com/b/finger-press-book-now-button-booking-reservation-icon-online-149789867.jpg"
                alt=""
                style={{
                  width: "100%",
                  height: "400px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </Col>

            {/* Booking Details Column */}
            <Col span={8} sm={24} xs={24} lg={8}>
              <div style={{ padding: "20px", background: "#f5f5f5", borderRadius: "10px" }}>
                <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "20px" }}>
                  <b>Timings :</b>{" "}
                  {doctor?.timings ? `${doctor.timings[0]} - ${doctor.timings[1]}` : "N/A"}
                </h1>
                <p style={{ fontSize: "1rem", marginBottom: "10px" }}>
                  <b>Phone Number : </b>
                  {doctor?.phoneNumber || "N/A"}
                </p>
                <p style={{ fontSize: "1rem", marginBottom: "10px" }}>
                  <b>Address : </b>
                  {doctor?.address || "N/A"}
                </p>
                <p style={{ fontSize: "1rem", marginBottom: "10px" }}>
                  <b>Fee per Visit : </b>
                  {doctor?.feePerCunsultation || "N/A"}
                </p>
                <p style={{ fontSize: "1rem", marginBottom: "10px" }}>
                  <b>Website : </b>
                  {doctor?.website || "N/A"}
                </p>

                {/* Date and Time Picker */}
                <div style={{ marginTop: "20px" }}>
                  <DatePicker
                    format="DD-MM-YYYY"
                    onChange={(value) => {
                      setDate(moment(value).format("DD-MM-YYYY"));
                      setIsAvailable(false);
                    }}
                    style={{
                      width: "100%",
                      marginBottom: "15px",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <TimePicker
                    format="HH:mm"
                    onChange={(value) => {
                      setIsAvailable(false);
                      setTime(moment(value).format("HH:mm"));
                    }}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>

                {/* Buttons */}
                {!isAvailable && (
                  <Button
                    style={{
                      marginTop: "20px",
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#005555",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={checkAvailability}
                  >
                    Check Availability
                  </Button>
                )}

                {isAvailable && (
                  <Button
                    style={{
                      marginTop: "20px",
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={bookNow}
                  >
                    Book Now
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Layout>
  );
}

export default BookAppointment;