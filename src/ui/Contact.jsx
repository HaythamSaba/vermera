import { Clock, MapPin, Phone } from "lucide-react";
import CoverBackgroundSection from "./CoverBackgroundSection";
import InputField from "./InputField";
import MainButton from "./MainButton";
const Contact = () => {
  return (
    <div>
      <CoverBackgroundSection title="Contact" path={["Home", "Contact"]} />
      <div className="py-20 mx-auto">
        <div className="text-center w-[650px] mx-auto mt-18">
          <h3 className="text-4xl font-semibold mb-4">Get In Touch With Us</h3>
          <p className="text-[#9F9F9F] text-basemy-4">
            For More Information About Our Product & Services. Please Feel Free
            To Drop Us An Email. Our Staff Always Be There To Help You Out. Do
            Not Hesitate!
          </p>
        </div>
        <div className="flex justify-center items-start mt-12 gap-20">
          <div className="">
            <div className="flex justify-center gap-8 p-2">
              <MapPin />
              <div>
                <p className="text-2xl font-medium">Address</p>
                <p className=" w-[212px]">
                  236 5th SE Avenue, New York NY10000, United States
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-8 p-2">
              <Phone />
              <div>
                <p className="text-2xl font-medium">Phone</p>
                <p className=" w-[212px]">
                  Mobile: +(84) 546-6789 Hotline: +(84) 456-6789{" "}
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-8 p-2">
              <Clock />
              <div>
                <p className="text-2xl font-medium">Working Time</p>
                <p className=" w-[212px]">
                  Monday-Friday: 9:00 - 22:00 <br />
                  Saturday-Sunday: 9:00 - 21:00
                </p>
              </div>
            </div>
          </div>
          <div className=" px-10">
            <div className="mb-12 w-[528px]">
              <InputField
                id="fullName"
                type="text"
                name="fullName"
                placeholder="John Doe"
                isRequired
                hasLabel
                labelText="Full Name"
              />
            </div>
            <div className="mb-12 w-[528px]">
              <InputField
              id="email"
              type="email"
              name="email"
              placeholder="Abc@def.com"
              isRequired
              hasLabel
              labelText="Email"
            />
            </div>
            <div className="mb-12 w-[528px]">
              <InputField
                id="subject"
                type="text"
                name="subject"
                placeholder="This field is optional"
                hasLabel
                labelText="Subject"
              />
            </div>
            <div className="mb-12 w-[528px]">
              <InputField
                id="message"
                type="textarea"
                name="message"
                placeholder="Hi! i’d like to ask about"
                hasLabel
                labelText="Message"
                className="h-40"
              />
            </div>
            <div>
              <MainButton content="Send Message" size="large" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
