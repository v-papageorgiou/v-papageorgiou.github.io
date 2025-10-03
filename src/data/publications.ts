import { colleagues } from './colleagues';

export interface Publication {
  title: string;
  authors: string[];
  venue: string;
  year: string;
  abstract: string;
  links: {
    paper: string;
    code?: string;
    website?: string;
  };
  tags: string[];
}

// Helper function to format authors with links
export const formatAuthors = (authors: string[]) => {
  return authors.map(author => {
    const colleague = colleagues[author];
    const website = colleague?.website;
    return {
      name: author,
      link: website && website !== '#'
        ? website
        : undefined
    };
  });
};

export const publications: Publication[] = [
  {
    title: "From Artificial Needles to Real Haystacks: Improving Retrieval Capabilities in LLMs by Finetuning on Synthetic Data",
    authors: ["Zheyang Xiong", "Vasilis Papageorgiou", "Kangwook Lee", "Dimitris Papailiopoulos"],
    venue: "ICLR",
    year: "2025",
    abstract: "Recent studies have shown that Large Language Models (LLMs) struggle to accurately retrieve information and maintain reasoning capabilities when processing long-context inputs. To address these limitations, we propose a finetuning approach utilizing a carefully designed synthetic dataset comprising numerical key-value retrieval tasks. Our experiments on models like GPT-3.5 Turbo and Mistral 7B demonstrate that finetuning LLMs on this dataset significantly improves LLMs' information retrieval and reasoning capabilities in longer-context settings. We present an analysis of the finetuned models, illustrating the transfer of skills from synthetic to real task evaluations (e.g., 10.5% improvement on 20 documents MDQA at position 10 for GPT-3.5 Turbo). We also find that finetuned LLMs' performance on general benchmarks remains almost constant while LLMs finetuned on other baseline long-context augmentation data can encourage hallucination. Our study highlights the potential of finetuning on synthetic data for improving the performance of LLMs on longer-context tasks.",
    links: {
      paper: "https://arxiv.org/abs/2406.19292"
    },
    tags: ["LLMs", "Information Retrieval", "Synthetic Data", "Long Context"]
  },
  {
    title: "Everything Everywhere All at Once: LLMs can In-Context Learn Multiple Tasks in Superposition",
    authors: ["Zheyang Xiong", "Ziyang Cai", "John Cooper", "Albert Ge", "Vasilis Papageorgiou", "Zack Sifakis", "Angeliki Giannou", "Ziqian Lin", "Liu Yang", "Saurabh Agarwal", "Grigorios G Chrysos", "Samet Oymak", "Kangwook Lee", "Dimitris Papailiopoulos"],
    venue: "ICML (Spotlight)",
    year: "2025",
    abstract: "Large Language Models (LLMs) have demonstrated remarkable in-context learning (ICL) capabilities. In this study, we explore a surprising phenomenon related to ICL: LLMs can perform multiple, computationally distinct ICL tasks simultaneously, during a single inference call, a capability we term 'task superposition'. We provide empirical evidence of this phenomenon across various LLM families and scales and show that this phenomenon emerges even if we train the model to in-context learn one task at a time. We offer theoretical explanations that this capability is well within the expressive power of transformers. We also explore how LLMs internally compose task vectors during superposition. Furthermore, we show that larger models can solve more ICL tasks in parallel, and better calibrate their output distribution. Our findings offer insights into the latent capabilities of LLMs, further substantiate the perspective of 'LLMs as superposition of simulators', and raise questions about the mechanisms enabling simultaneous task execution.",
    links: {
      paper: "https://arxiv.org/abs/2410.05603"
    },
    tags: ["LLMs", "In-Context Learning", "Task Superposition", "Machine Learning"]
  },
  {
    title: "Design and implementation of ambiently powered Internet of Things-that-think With asynchronous inference",
    authors: ["Vasilis Papageorgiou", "Athanasios Nichoritis", "Panagiotis Vasilakopoulos", "Georgios Vougioukas", "Aggelos Bletsas"],
    venue: "IEEE Internet of Things Journal",
    year: "2023",
    abstract: "This work offers design and implementation of in-network inference, using message passing among ambiently powered wireless sensor network (WSN) terminals. The stochastic nature of ambient energy harvesting dictates intermittent operation of each WSN terminal and as such, the message passing inference algorithms should be robust to asynchronous operation. It is shown, perhaps for the first time in the literature (to the best of our knowledge), a proof of concept, where a WSN harvests energy from the environment and processes itself the collected information in a distributed manner, by converting the (network) inference task to a probabilistic, in-network message passing problem, often at the expense of increased total delay. Examples from Gaussian belief propagation and average consensus (AC) are provided, along with the derivation of a statistical convergence metric for the latter case. A k-means method is offered that maps the elements of the calculated vector to the different WSN terminals and overall execution delay (in number of iterations) is quantified. Interestingly, it is shown that there are divergent instances of the in-network message passing algorithms that become convergent, under asynchronous operation. Ambient solar energy harvesting availability is also studied, controlling the probability of successful (or not) message passing. Hopefully, this work will spark further interest for asynchronous message passing algorithms and technologies that enable in-network inference, toward ambiently powered, batteryless Internet of Things-That-Think.",
    links: {
      paper: "https://ieeexplore.ieee.org/abstract/document/10097494"
    },
    tags: ["IoT", "Ambient Power", "Asynchronous Inference", "Wireless Sensor Networks"]
  },
  {
    title: "Towards ambiently powered inference on wireless sensor networks: Asynchrony is the key!",
    authors: ["Vasilis Papageorgiou", "Athanasios Nichoritis", "Panagiotis Vasilakopoulos", "Georgios Vougioukas", "Aggelos Bletsas"],
    venue: "2021 17th International Conference on Distributed Computing in Sensor Systems (DCOSS)",
    year: "2021",
    abstract: "Is it possible to build ultra-low power wireless sensor networks (WSN) that exploit the inherent parallel and distributed nature of powerful message passing/inference algorithms, embrace ultra-low power communication principles and make autonomous, in-network decisions, solely powered by the environment? While edge and cloud computing emerge, this work points towards the opposite direction, inspired by the fact that ambient energy, either from radio frequency (RF), sun, motion, temperature or even living organisms, has fixed (on average) density per surface (or volume). It is shown, perhaps for the first time in the literature (to the best of our knowledge), a proof of concept, where a WSN harvests energy from the environment and processes itself the collected information in a distributed manner, by converting the (network) inference task to a probabilistic, message passing problem. Examples from Gaussian Belief Propagation and Average Consensus are offered; ambient energy harvesting and availability are quantified, controling the probability of successful (or not) message passing. Such interrupted communication requires distributed algorithms robust to asynchrony, at the expense of increased overall delay. Simulation and experimental validation are offered in a WSN testbed with solar energy harvesting. Future work will focus on overall delay minimization.",
    links: {
      paper: "https://ieeexplore.ieee.org/abstract/document/9600006"
    },
    tags: ["Wireless Sensor Networks", "Distributed Computing", "Asynchronous Algorithms", "Ambient Power"]
  }
];

export const preprints = [
  // Add preprints/working papers here
];

export const theses = [
  {
    title: "Distributed Inference Algorithms for Wireless Sensor Networks",
    type: "Diploma Thesis",
    institution: "Technical University of Crete",
    year: "2022",
    advisor: "Aggelos Bletsas",
    abstract: "This thesis explores distributed inference algorithms for wireless sensor networks, focusing on asynchronous methods that improve energy efficiency while maintaining convergence guarantees.",
    links: {
      thesis: "#" // Replace with actual thesis URL
    }
  }
];
