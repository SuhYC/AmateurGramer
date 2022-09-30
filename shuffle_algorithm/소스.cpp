#include <vector>
#include <iostream>
#include <random>

#define SIZEOFINPUT 1000

void shuffle_bubble(std::vector<int> &v,int trynum) {
	if (trynum < 0)
		return;

	std::cout << "shuffle_bubble.\n";

	std::random_device rd;
	std::mt19937 gen(rd());
	std::uniform_int_distribution<int> dis(0, 1);

	while (trynum--)
		for (int i = 0; i < v.size(); i++) {
			if (dis(gen)) {
				if (i == v.size() - 1) {
					int tmp = v[i];
					v[i] = v[0];
					v[0] = tmp;
				}
				else {
					int tmp = v[i];
					v[i] = v[i + 1];
					v[i + 1] = tmp;
				}
			}
		}
	return;
}

void shuffle_advanced(std::vector<int> &v, int trynum) {
	if (trynum < 0)
		return;

	std::cout << "shuffle_advanced.\n";

	std::random_device rd;
	std::mt19937 gen(rd());
	std::uniform_int_distribution<int> dis(0, SIZEOFINPUT - 1);

	while (trynum--) {
		for (int i = 0; i < v.size(); i++) {
			int target_idx = dis(gen);

			if (target_idx == i)
				continue;

			int tmp = v[i];
			v[i] = v[target_idx];
			v[target_idx] = tmp;
		}
	}
}

int main() {

	std::vector<int> v(SIZEOFINPUT);
	for (int i = 0; i < v.size(); i++) {
		v[i] = i;
	}
	clock_t start_time = clock(); // 측정 시작

	//shuffle_bubble(v, SIZEOFINPUT);
	shuffle_advanced(v, 1);

	clock_t end_time = clock(); // 측정 종료
	std::cout << "it takes " << end_time - start_time << "ms\n";

	int result = 0; // 잘 섞였는지 확인하는 변수. 각 인덱스의 원소가 시작 이전과 다를경우 increment.
	for (int i = 0; i < v.size(); i++) {
		if (v[i] != i)
			result++;
	}
	std::cout << "result is " << result << "/" << SIZEOFINPUT << "\n\n\n";

	return 0;
}