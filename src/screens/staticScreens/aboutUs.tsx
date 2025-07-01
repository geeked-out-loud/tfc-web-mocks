import { BarChart2, Check, Users2, ClipboardCheck, Headphones, Divide } from "lucide-react";

export default function AboutUs() {
  return (
    <>
      {/* Hero Section */}
      <div className="bg-black overflow-hidden shadow-2xl">
        <div className="relative">
          <img
            src="/abt_hero.png"
            alt="About TFC Hero"
            className="w-full h-[420px] object-cover object-center"
            style={{ minHeight: '250px', background: '#222' }}
          />
          {/* Smoother Gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.7) 85%, #000 100%)"
            }}
          />
          {/* Heading and Subheading */}
          <div className="absolute left-0 right-0 top-0 h-full flex flex-col justify-end items-start px-4 md:px-16 pb-6 md:pb-10 lg:pb-14 z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold ddc-hardware mb-4 text-white tracking-wide drop-shadow-lg">
              <span className="mr-2">ABOUT</span>
              <span style={{ color: '#d7a900' }}>TFC</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-white drop-shadow-lg">
              Because Fitness Isn’t Just a Goal. It’s a Journey – And We’re With You Every Step of the Way.
            </p>
          </div>
        </div>
        {/* Black div for bullet points, matching horizontal padding */}
        <div className="px-4 md:px-16 pt-4 pb-8 md:pt-4 md:pb-10 bg-black">
          <ul className="space-y-8 text-base sm:text-lg text-gray-200">
            <li className="flex items-start">
              <span className="inline-block w-4 h-1.5 mt-3 mr-4 bg-[#d7a900] flex-shrink-0"></span>
              <span className="leading-relaxed">
                At The Fit Collective (TFC), we believe that health and fitness are deeply personal. No two bodies are alike. No two journeys are the same. Your lifestyle, your goals, your limitations, and your aspirations they deserve to be understood, respected, and supported with care.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-1.5 mt-3 mr-4 bg-[#d7a900] flex-shrink-0"></span>
              <span className="leading-relaxed">
                That’s why we created TFC — not just as a fitness app, but as a complete, personalised fitness ecosystem, designed to adapt to your unique needs and grow with you.
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-4 h-1.5 mt-3 mr-4 bg-[#d7a900] flex-shrink-0"></span>
              <span className="leading-relaxed">
                Whether you prefer in-person training, live online sessions, or self-guided workouts at your own pace — TFC puts the power of customised fitness right in your hands.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-full py-8 px-4 md:px-16 text-gray-900">
        <section className="mb-10">
          <h2 className="text-4xl font-bold py-8 ddc-hardware">Our Philosophy – Fitness Made Personal</h2>
          <p className="text-gray-700 max-w-3xl">
            We’ve seen how generic workout plans and rigid schedules often fail to deliver real, sustainable results. That’s because true fitness isn’t about following a one-size-fits-all routine — it’s about understanding your body, building healthy habits, and having expert support tailored to YOU.
          </p>
        </section>

        <section className="mb-10">
            <h2 className="text-xl font-bold mb-2 poppins-bold">At TFC Our Approach Combines:</h2>
            <div className="w-full bg-white py-10 px-2 md:px-8">
              <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-4 max-w-5xl mx-auto">
                {/* Card 1 */}
                <div className="flex flex-col items-center text-center min-w-[200px]">
                  <div className="bg-[#d7a900] rounded-full w-20 h-20 flex items-center justify-center mb-4">
                    {/* Replace with your icon */}
                    <BarChart2 />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1">Scientific Assessments</div>
                    <div className="text-gray-700 text-sm">
                      to understand your posture, movement<br />patterns, and health status.
                    </div>
                  </div>
                </div>
                {/* Card 2 */}
                <div className="flex flex-col items-center text-center min-w-[200px]">
                  <div className="bg-[#d7a900] rounded-full w-20 h-20 flex items-center justify-center mb-4">
                    {/* Replace with your icon */}
                    <Users2 />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1">Expert Trainers &amp; Nutritionists</div>
                    <div className="text-gray-700 text-sm">
                      who design your plans, guide your<br />form, and track your progress.
                    </div>
                  </div>
                </div>
                {/* Card 3 */}
                <div className="flex flex-col items-center text-center min-w-[200px]">
                  <div className="bg-[#d7a900] rounded-full w-20 h-20 flex items-center justify-center mb-4">
                    {/* Replace with your icon */}
                    <ClipboardCheck />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1">Flexibility &amp; Freedom</div>
                    <div className="text-gray-700 text-sm">
                      to choose how you want to train at our<br />facility, virtually, or independently.
                    </div>
                  </div>
                </div>
                {/* Card 4 */}
                <div className="flex flex-col items-center text-center min-w-[200px]">
                  <div className="bg-[#d7a900] rounded-full w-20 h-20 flex items-center justify-center mb-4">
                    {/* Replace with your icon */}
                    <Headphones />
                  </div>
                  <div>
                    <div className="font-bold text-lg mb-1">Continuous Support &amp;<br />Plan Updates</div>
                    <div className="text-gray-700 text-sm">
                      so your fitness journey evolves with<br />you.
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </section>
      </div>

      <div className="w-full bg-[#f6f6f6] py-8 px-4 md:px-16 text-gray-900">
        <section className="mb-10 justify-center items-center text-center">
          <h2 className="text-4xl font-bold py-8 ddc-hardware">
            What you get with
          <span
            className="border-t-2 border-b-2 border-[#d7a900] px-2"
          >
            TFC
          </span>
          </h2>
            <div className="py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <img 
                      src="/abtBG1.png" 
                      alt="TFC Training" 
                      className="w-full h-auto object-cover rounded-md"
                    />
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 ddc-hardware">
                      1. Personalised assessments
                    </h2>
                    <p className="text-base text-black/70 poppins-regular">
                      Your journey starts with understanding you. Through posture, movement, and goal assessments — online or at our physical facility — we gain insights to build your ideal fitness roadmap.
                    </p>
                  </div>
                </div>
              </div>
            </div>
        </section>
      </div>
      <div className="w-full bg-white py-8 px-4 md:px-16 pt-12 text-gray-900">
        <section className="mb-10 justify-center items-center">
          <div className="text-left mb-6 px-2 md:px-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-8 ddc-hardware">
          2. Flexible training options
        </h2>
        <p className="text-base text-black/70 poppins-regular mb-8 max-w-xl">
          We understand life gets busy. That’s why we offer options to fit your schedule and preferences:
        </p>
          </div>
          <div className="w-full overflow-x-auto px-2 md:px-8 scrollbar-hide">
        <div className="flex flex-row gap-6 md:gap-8 min-w-[700px] py-4">
          {/* In-Person Training */}
          <div className="w-[22rem] flex-shrink-0 bg-gray-50 rounded-lg border border-1 border-gray-900 shadow-none p-0 flex flex-col items-stretch">
            <div className="w-full h-40 rounded-t-lg overflow-hidden border-b border-gray-900/10">
          <img
            src="/live_sessions.jpg"
            alt="In-Person Training"
            className="w-full h-full object-cover"
          />
            </div>
            <div className="p-6 flex flex-col items-start">
          <div className="font-bold text-lg mb-2 text-left ddc-hardware">In-Person Training</div>
          <div className="text-gray-700 text-sm text-left">
            Work with our expert trainers at our state-of-the-art facility for hands-on guidance and motivation.
          </div>
            </div>
          </div>
          {/* Live Online Sessions */}
          <div className="w-[22rem] flex-shrink-0 bg-gray-50 rounded-lg border border-1 border-gray-900 shadow-none p-0 flex flex-col items-stretch">
            <div className="w-full h-40 rounded-t-lg overflow-hidden border-b border-gray-900/10">
          <img
            src="/online_sessions.jpg"
            alt="Live Online Sessions"
            className="w-full h-full object-cover"
          />
            </div>
            <div className="p-6 flex flex-col items-start">
          <div className="font-bold text-lg mb-2 text-left ddc-hardware">Live Online Sessions</div>
          <div className="text-gray-700 text-sm text-left">
            Join interactive, real-time sessions from anywhere, with direct feedback and support from your coach.
          </div>
            </div>
          </div>
          {/* Self-Guided Plans */}
          <div className="w-[22rem] flex-shrink-0 bg-gray-50 rounded-lg border border-1 border-gray-900 shadow-none p-0 flex flex-col items-stretch">
            <div className="w-full h-40 rounded-t-lg overflow-hidden border-b border-gray-900/10">
          <img
            src="/exercise.jpg"
            alt="Self-Guided Plans"
            className="w-full h-full object-cover"
          />
            </div>
            <div className="p-6 flex flex-col items-start">
          <div className="font-bold text-lg mb-2 text-left ddc-hardware">Self-Guided Plans</div>
          <div className="text-gray-700 text-sm text-left">
            Access personalised workout plans and resources to train independently, on your own schedule.
          </div>
            </div>
          </div>
        </div>
          </div>
        </section>
      </div>
      <div className="pb-16 bg-[#f6f6f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="order-1 lg:order-1">
          <img 
            src="/experts.png" 
            alt="TFC Expert Team" 
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
        <div className="order-2 lg:order-2">
          <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 ddc-hardware">
            3. Expert guidance & support
          </h3>
          <p className="text-base text-gray-700 poppins-regular leading-relaxed mb-8">
            Our team of experienced trainers and nutritionists stay connected with you throughout your journey. From creating your workout plan to conducting weekly reviews, they ensure your progress never stalls.
          </p>
          <li className="flex items-start my-4">
            <span className="inline-block w-4 h-1.5 mt-3 mr-4 bg-[#d7a900] flex-shrink-0"></span>
            <span className="leading-relaxed text-black">
              Regular training reviews.
            </span>
          </li>
          <li className="flex items-start my-4">
            <span className="inline-block w-4 h-1.5 mt-3 mr-4 bg-[#d7a900] flex-shrink-0"></span>
            <span className="leading-relaxed text-black">
            Plan modifications based on your progress, feedback, and lifestyle. 
            </span>
          </li>
          <li className="flex items-start my-4">
            <span className="inline-block w-4 h-1.5 mt-3 mr-4 bg-[#d7a900] flex-shrink-0"></span>
            <span className="leading-relaxed text-black">
              Form corrections through video uploads and expert feedback.
            </span>
          </li>
          <li className="flex items-start my-4">
            <span className="inline-block w-4 h-1.5 mt-3 mr-4 bg-[#d7a900] flex-shrink-0"></span>
            <span className="leading-relaxed text-black">
            Nutrition plan adjustments as needed.
            </span>
          </li>
          </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-white py-8 px-4 md:px-16 text-gray-900">
        <section className="mb-10 flex justify-center items-center">
          <div className="py-12 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col justify-center h-full text-left">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 ddc-hardware">
            4. Progress Tracking Made Simple
          </h2>
          <p className="text-base text-black/70 mb-8 poppins-regular">
            TFC is designed to make monitoring your fitness effortless:
          </p>
          <ul>
            <li className="flex items-start my-4">
              <span className="inline-block w-4 h-1.5 mt-3 mr-4 bg-[#d7a900] flex-shrink-0"></span>
              <span className="leading-relaxed text-black">
            Log your meals with text or pictures for nutritionist feedback.
              </span>
            </li>
            <li className="flex items-start my-4">
              <span className="inline-block w-4 h-1.5 mt-3 mr-4 bg-[#d7a900] flex-shrink-0"></span>
              <span className="leading-relaxed text-black">
            Record and upload your exercise videos for form checks.
              </span>
            </li>
            <li className="flex items-start my-4">
              <span className="inline-block w-4 h-1.5 mt-3 mr-4 bg-[#d7a900] flex-shrink-0"></span>
              <span className="leading-relaxed text-black">
            Track your routines, plans, and progress all in one place.
              </span>
            </li>
          </ul>
            </div>
            <div className="flex justify-center items-center h-full">
          <img
            src="/foodCollection.png"
            alt="TFC Training"
            className="max-w-full h-auto object-cover rounded-md"
          />
            </div>
          </div>
        </div>
          </div>
        </section>
      </div>
      <div className="w-full bg-white p-4 flex justify-center">
        <div className="w-full flex justify-center">
          <div
        className="w-full max-w-6xl rounded-md shadow-xl overflow-hidden flex items-center justify-center bg-black p-0.5"
        style={{
          boxShadow: "0 1px 12px 0 rgba(0,0,0,0.12)",
          margin: "1rem 0",
          background: "linear-gradient(to bottom, #fcf8eb, #9a9a9a)"
        }}
          >
        <div className="w-full rounded-md flex flex-col bg-gradient-to-b from-[#fcf8eb] to-white p-8 md:p-12">
          {/* Row 1: Image and text */}
          <div className="flex flex-col lg:flex-row items-center">
            <div className="flex items-center justify-center mb-6 lg:mb-0 lg:mr-10">
          <img
            src="/mdi_shield-tick.png"
            alt="Shield Check"
            className="w-48 h-48 object-contain"
          />
            </div>
            <div className="flex-1 flex flex-col justify-center py-4 px-0 md:px-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 ddc-hardware">
            OUR PROMISE TO YOU
          </h2>
          <p className="text-base text-black/70 poppins-regular mb-6 max-w-2xl">
            We’re not here to sell you a generic plan. We’re here to help you build a sustainable, enjoyable relationship with fitness.
          </p>
          <ul className="text-base text-gray-900 poppins-regular space-y-4 max-w-xl">
            <li className="flex items-baseline">
              <span className="font-bold text-gray-900 min-w-[9rem]">No guesswork</span>
              <span className="ml-2 text-black/70">– only expert-designed routines that suit you.</span>
            </li>
            <li className="flex items-baseline">
              <span className="font-bold text-gray-900 min-w-[9rem]">No intimidation</span>
              <span className="ml-2 text-black/70">– only expert-designed routines that suit you.</span>
            </li>
            <li className="flex items-baseline">
              <span className="font-bold text-gray-900 min-w-[9rem]">No rigid rules</span>
              <span className="ml-2 text-black/70">– only expert-designed routines that suit you.</span>
            </li>
          </ul>
            </div>
          </div>
          {/* Row 2: Separator and extra text */}
          <div className="flex flex-col items-start justify-center mt-8">
            <hr className="border-t border-gray-300 my-6 w-full" />
            <p className="text-base text-black/70 poppins-regular text-md mb-0 max-w-6xl text-start">
          Your goals may be big or small, your schedule may be tight or open — either way, we’re committed to walking alongside you, empowering you with the tools, support, and expertise you deserve.
            </p>
          </div>
        </div>
          </div>
        </div>
      </div>

<div className="max-w-full py-8 px-4 md:px-16 text-gray-900">
        <section className="mb-10">
          <h2 className="text-4xl font-bold py-8 ddc-hardware">The TFC Trainer Network – Your Support System</h2>
          <p className="text-gray-700 max-w-3xl">
            Behind the scenes, our dedicated team of trainers and nutritionists use the TFC Trainer App to:
          </p>
        </section>

      <section className="mb-10">
            <div className="flex flex-col lg:flex-row gap-10 items-center justify-center w-full">
              {/* Left: Mobile mockup image */}
                <div className="flex justify-center items-center w-full lg:w-1/2 mb-8 lg:mb-0">
                <img
                  src="/mockup.png"
                  alt="TFC App Mockup"
                  className="max-w-md w-full h-auto object-contain"
                  style={{ minWidth: 420, maxWidth: 480 }}
                />
                </div>
                {/* Right: Feature list */}
                <div className="flex flex-col gap-4 w-full lg:w-1/2">
                <div
                  className="flex items-start rounded-lg px-6 py-4 shadow-sm border border-[#f3e7c2]"
                  style={{
                  background:
                    "linear-gradient(to bottom, #faf6e5 0%, #fdfaf1 80%, transparent 100%)"
                  }}
                >
                  <Check className="text-[#d7a900] mt-1 mr-4 w-6 h-6 flex-shrink-0" />
                  <span className="text-gray-800 text-base">
                  Access your assessment reports and tailor your fitness plan.
                  </span>
                </div>
                <div
                  className="flex items-start rounded-lg px-6 py-4 shadow-sm border border-[#f3e7c2]"
                  style={{
                  background:
                    "linear-gradient(to bottom, #faf6e5 0%, #fdfaf1 80%, transparent 100%)"
                  }}
                >
                  <Check className="text-[#d7a900] mt-1 mr-4 w-6 h-6 flex-shrink-0" />
                  <span className="text-gray-800 text-base">
                  Create customised exercise and nutrition routines.
                  </span>
                </div>
                <div
                  className="flex items-start rounded-lg px-6 py-4 shadow-sm border border-[#f3e7c2]"
                  style={{
                  background:
                    "linear-gradient(to bottom, #faf6e5 0%, #fdfaf1 80%, transparent 100%)"
                  }}
                >
                  <Check className="text-[#d7a900] mt-1 mr-4 w-6 h-6 flex-shrink-0" />
                  <span className="text-gray-800 text-base">
                  Track your meal logs, exercise videos, and progress.
                  </span>
                </div>
                <div
                  className="flex items-start rounded-lg px-6 py-4 shadow-sm border border-[#f3e7c2]"
                  style={{
                  background:
                    "linear-gradient(to bottom, #faf6e5 0%, #fdfaf1 80%, transparent 100%)"
                  }}
                >
                  <Check className="text-[#d7a900] mt-1 mr-4 w-6 h-6 flex-shrink-0" />
                  <span className="text-gray-800 text-base">
                  Stay proactive with weekly reviews and plan updates.
                  </span>
                </div>
                <div
                  className="flex items-start rounded-lg px-6 py-4 shadow-sm border border-[#f3e7c2]"
                  style={{
                  background:
                    "linear-gradient(to bottom, #faf6e5 0%, #fdfaf1 80%, transparent 100%)"
                  }}
                >
                  <Check className="text-[#d7a900] mt-1 mr-4 w-6 h-6 flex-shrink-0" />
                  <span className="text-gray-800 text-base">
                  Send feedback, corrections, and motivation — directly to you.
                  </span>
                </div>
                </div>
              </div>
        </section>
      </div>

      {/* Footer Section: Fitness is a Circle */}
      <div className="bg-black overflow-hidden shadow-2xl">
        <div className="relative">
          <img
            src="/abtFooter.png"
            alt="Fitness Circle Footer"
            className="w-full h-[340px] object-right sm:h-[340px] xs:h-[220px] min-h-[220px]"
            style={{ background: '#222' }}
          />
            {/* Gradient overlay */}
            <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
              "linear-gradient(to left, rgba(0,0,0,0) 5%, rgba(0,0,0,1) 80%, #000 100%)"
            }}
            />
          {/* Heading and bullet points */}
          <div className="absolute left-0 right-0 top-0 h-full flex flex-col justify-end items-start px-4 md:px-16 py-6 md:py-10 lg:py-14 z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold ddc-hardware mb-4 sm:mb-6 text-white tracking-wide drop-shadow-lg uppercase leading-tight sm:leading-tight">
              Because Fitness Isn’t a Destination. It’s a Circle.
            </h2>
            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-lg text-gray-200 mb-2 max-w-xl sm:max-w-4xl">
              <li className="flex items-start">
                <span className="inline-block w-4 h-1.5 mt-2 sm:mt-3 mr-3 sm:mr-4 bg-[#d7a900] flex-shrink-0"></span>
                <span className="leading-relaxed">
                  At TFC, we’re building a community — a circle — where fitness feels approachable, sustainable, and rewarding. It’s not about temporary transformations. It’s about building strength, health, and confidence that lasts.
                </span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-4 h-1.5 mt-2 sm:mt-3 mr-3 sm:mr-4 bg-[#d7a900] flex-shrink-0"></span>
                <span className="leading-relaxed">
                  Wherever you are in your fitness journey — beginner, returning, or looking for that next challenge — TFC is ready to support you.
                </span>
              </li>
            </ul>
          </div>
        </div>
        {/* Call to Action Bar */}
        <div className="w-full bg-black py-10 px-4 md:px-16 flex flex-col items-center justify-center">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold ddc-hardware text-white text-center tracking-wide">
            JOIN THE CIRCLE. <span className="text-[#d7a900]">LET’S MOVE FORWARD</span>, TOGETHER.
          </h3>
        </div>
      </div>
    </>
    );
}