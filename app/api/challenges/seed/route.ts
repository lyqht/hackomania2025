import { createChallenge } from "@/app/services/challenge";
import { NextResponse } from "next/server";

const INITIAL_CHALLENGES = [
  {
    name: "Health Education, Awareness & Healthy Habits",
    description: `Many Singaporeans - 8 out of 10 - exercise regularly, but maintaining long-term healthy habits—such as balanced nutrition, regular check-ups, and mental well-being—is still a challenge. There is much room for improvement in promoting holistic health education and sustainable habits beyond physical fitness.

Key Questions:
- How can digital tools promote education on nutrition, wellness, and long-term mental health alongside fitness routines?
- What solutions can help people integrate fitness and holistic health practices into their daily lives in an accessible and sustainable way?
- How can AI be leveraged to promote and personalize health education, encouraging individuals to adopt and maintain healthier lifestyle habits?`,
    metadata: {
      teamQuota: 10,
      judges: ["TBD"],
      references: [
        "https://globalwellnessinstitute.org/geography-of-wellness/wellness-in-singapore-2024/",
        "https://www.asiaone.com/lifestyle/fitness-study-shows-8-out-10-singaporeans-exercise-once-week-our-thoughts",
      ],
    },
  },
  {
    name: "Quitting Addictions",
    description: `Addictions such as smoking, unhealthy eating, and excessive screen time remain common in Singapore, posing significant health risks. While 9.5% of adults smoke, the rise in screen addiction (over 4.5 hours of daily screen time on non-work-related activities) also poses challenges to physical, mental, and social health.

Key Questions:
- How can we create tools that provide personalized support for quitting harmful habits and replacing them with healthier alternatives?
- What kind of technology or community-based solutions can help people quit addictions like smoking or reduce screen time to improve overall health?
- How can behavior-modification strategies be applied to support individuals in overcoming addiction and adopting healthier lifestyles?
- In what ways can AI assist in supporting individuals to overcome addictive behaviors and foster healthier habits through personalized strategies?`,
    metadata: {
      teamQuota: 10,
      judges: ["TBD"],
      references: [
        "https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2024.1359929/full",
        "https://www.channelnewsasia.com/singapore/national-population-health-survey-physical-activity-mental-help-3157121",
        "https://globalwellnessinstitute.org/geography-of-wellness/wellness-in-singapore-2024/",
        "https://www.straitstimes.com/singapore/smokers-in-singapore-cutting-down-on-cigarettes-but-more-people-vaping-survey",
      ],
    },
  },
  {
    name: "Connecting to the Real World",
    description: `In an increasingly digital society, many Singaporeans feel disconnected from real-world experiences, leading to social isolation and mental health challenges. Although more residents are seeking professional help, fewer are turning to informal support networks such as friends, family, or community groups. This shift highlights a growing gap in community-based support, emphasizing the need for solutions that encourage deeper real-world connections and strengthen informal social ties.

Key Questions:
- How can technology encourage individuals to engage more with their communities and participate in real-world social activities?
- What solutions can bridge the gap between online engagement and real-world interactions to promote healthier mental and social well-being?
- How can tools be designed to foster stronger social connections and reduce feelings of isolation in an increasingly digital world?
- How can AI help identify patterns of social isolation and encourage individuals to engage in more meaningful real-world connections?`,
    metadata: {
      teamQuota: 10,
      judges: ["TBD"],
      references: [
        "https://www.channelnewsasia.com/singapore/national-population-health-survey-physical-activity-mental-help-3157121",
      ],
    },
  },
];

export async function POST() {
  try {
    const results = await Promise.all(
      INITIAL_CHALLENGES.map((challenge) => createChallenge(challenge)),
    );
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error seeding challenges:", error);
    return NextResponse.json(
      { error: "Failed to seed challenges" },
      {
        status: 500,
      },
    );
  }
}
