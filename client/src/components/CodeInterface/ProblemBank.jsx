const problemDescription = (
    <div className="problem-description">
      <h2>Two Sum</h2>
      <p>Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.</p>
      
      <div className="example-flow">
        <p>Example 1:</p>
        <p>Input: nums = [2,7,11,15], target = 9</p>
        <p>Output: [0,1]</p>
        <p>Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</p>
      </div>
  
      <ul className="constraints-list">
        <li>2 ≤ nums.length ≤ 10⁴</li>
        <li>-10⁹ ≤ nums[i] ≤ 10⁹</li>
        <li>-10⁹ ≤ target ≤ 10⁹</li>
        <li>Only one valid answer exists.</li>
      </ul>
    </div>
  );

  const testCases = {
    case1: {
      nums: [2, 7, 11, 15],
      target: 9,
      expectedOutput: [0, 1]
    },
    case2: {
      nums: [-3, 4, 3, 90],
      target: 0,
      expectedOutput: [0, 2]
    },
    case3: {
      nums: [1, 2],
      target: 3,
      expectedOutput: [0, 1]
    },
    case4: {
      nums: [-5, -3, -2, -1],
      target: -4,
      expectedOutput: [1, 3]
    },
    case5: {
      nums: [1000000000, 2000000000, 3000000000, -1000000000],
      target: 3000000000,
      expectedOutput: [0, 1]
    },
    case6: {
      nums: Array(10).fill(1),
      target: 2,
      expectedOutput: [0, 1]
    },
    case7: {
      nums: [1, 2, 3, 4],
      target: 7,
      expectedOutput: [2, 3]
    },
    case8: {
      nums: [0, 4, 6, 2, 8],
      target: 10,
      expectedOutput: [1, 2]
    },
    case9: {
      nums: [3, 3, 3, 3],
      target: 6,
      expectedOutput: [0, 1]
    },
    case10: {
      nums: [5, -3, 7, 2, -4],
      target: 3,
      expectedOutput: [2, 4]
    }
  };

  const defaultFunction = [
    "def twoSum(nums, target):"
  ]

const problemBank = [[problemDescription, testCases, defaultFunction]];

export default problemBank