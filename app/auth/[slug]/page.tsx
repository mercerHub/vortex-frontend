import LoginForm from "@/components/auth/loginForm"
import SignupForm from "@/components/auth/signupForm"

interface Props {
    params: Promise<{ slug: string }>
}

async function AuthPage({params}: Props) {
    const {slug} = await params
    const isLoginPage = slug === "login"
    const isSignUpPage = slug === "sign-up"


    return (
        <section className="min-h-screen flex items-stretch text-white"
        style={{
          backgroundImage:
            "url(/assets/auth/tryAiTutor.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        >
          {/* Left Image Section */}
          <div
            className="lg:flex lg:w-1/2 hidden bg-no-repeat bg-cover relative items-center"
            style={{
              backgroundImage:
                "url(/assets/illustrations/Questions-bro_1.png)",
            }}
          >
            {/* <div className="absolute bg-black/20 b inset-0 z-0"></div> */}
            <div className="w-full z-10 text-gray-800 px-10 py-6 bg-white/30 backdrop-blur-xs items-center">
              <h1 className="text-5xl font-bold tracking-wide text-center">Lets Work it out!!</h1>
              <p className="text-3xl my-4">
                Share your thoughts with the world with Vortex
              </p>
            </div>
          </div>
    
          {/* Right Content Section */}
          {isLoginPage && <LoginForm/>}
          {isSignUpPage && <SignupForm/>}
    
        </section>
      )
}

export default AuthPage
