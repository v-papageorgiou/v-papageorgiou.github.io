export interface Colleague {
  name: string;
  website?: string;
}

export const colleagues: Record<string, Colleague> = {
  "Dimitris Papailiopoulos": {
    name: "Dimitris Papailiopoulos",
    website: "https://papail.io"
  },
  "Aggelos Bletsas": {
    name: "Aggelos Bletsas",
    website: "https://www.winlab.rutgers.edu/~aggelos/"
  },
  "Zheyang Xiong": {
    name: "Zheyang Xiong",
    website: "#" // Replace with actual website if available
  },
  "Kangwook Lee": {
    name: "Kangwook Lee", 
    website: "#" // Replace with actual website if available
  },
  "Ziyang Cai": {
    name: "Ziyang Cai",
    website: "#" // Replace with actual website if available
  },
  "John Cooper": {
    name: "John Cooper",
    website: "#" // Replace with actual website if available
  },
  "Albert Ge": {
    name: "Albert Ge",
    website: "#" // Replace with actual website if available
  },
  "Zack Sifakis": {
    name: "Zack Sifakis",
    website: "#" // Replace with actual website if available
  },
  "Angeliki Giannou": {
    name: "Angeliki Giannou",
    website: "#" // Replace with actual website if available
  },
  "Ziqian Lin": {
    name: "Ziqian Lin",
    website: "#" // Replace with actual website if available
  },
  "Athanasios Nichoritis": {
    name: "Athanasios Nichoritis",
    website: "#" // Replace with actual website if available
  },
  "Panagiotis Vasilakopoulos": {
    name: "Panagiotis Vasilakopoulos",
    website: "#" // Replace with actual website if available
  },
  "Georgios Vougioukas": {
    name: "Georgios Vougioukas",
    website: "#" // Replace with actual website if available
  },
  "Liu Yang": {
    name: "Liu Yang",
    website: "#" // Replace with actual website if available
  },
  "Saurabh Agarwal": {
    name: "Saurabh Agarwal",
    website: "#" // Replace with actual website if available
  },
  "Grigorios G Chrysos": {
    name: "Grigorios G Chrysos",
    website: "#" // Replace with actual website if available
  },
  "Samet Oymak": {
    name: "Samet Oymak",
    website: "#" // Replace with actual website if available
  }
  // Add more colleagues here as needed
  // "John Doe": {
  //   name: "John Doe",
  //   website: "https://johndoe.example.com",
  //   affiliation: "Example University",
  //   title: "Assistant Professor"
  // }
};

// Helper function to get colleague link
export const getColleagueLink = (name: string): string => {
  const colleague = colleagues[name];
  return colleague?.website || "#";
};

// Helper function to get formatted colleague name with link
export const getColleagueDisplay = (name: string): { name: string; link: string } => {
  const colleague = colleagues[name];
  return {
    name: colleague?.name || name,
    link: colleague?.website || "#"
  };
};
