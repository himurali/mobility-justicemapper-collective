
import React from 'react';

interface SolutionSectionProps {
  solution: string;
}

const SolutionSection: React.FC<SolutionSectionProps> = ({ solution }) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-2 text-green-700 dark:text-green-300">
        Proposed Solution
      </h3>
      <p className="text-muted-foreground">{solution}</p>
    </div>
  );
};

export default SolutionSection;
