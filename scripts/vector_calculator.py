import json
import numpy as np

# Load song vectors from JSON file
def load_song_vectors(file_path):
    """
    JSON 파일에서 노래 벡터를 로드하여 제목을 키로, 
    벡터를 값으로 하는 딕셔너리를 반환합니다.
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    song_vectors = {item['title']: item['advancedGenre'] for item in data}
    return song_vectors

def vector_similarity(x, y):
    """
    두 벡터 x, y의
    - 코사인 유사도 (1에 가까울수록 유사)
    - 유클리드 거리 (0에 가까울수록 유사)
    - 맨해튼 거리 (0에 가까울수록 유사)
    를 한꺼번에 계산해 돌려줘.
    """
    x = np.asarray(x, dtype=float)
    y = np.asarray(y, dtype=float)

    # 코사인 유사도
    cos_sim = np.dot(x, y) / (np.linalg.norm(x) * np.linalg.norm(y))

    # 유클리드 거리
    euclidean_dist = np.linalg.norm(x - y)

    # 맨해튼 거리
    manhattan_dist = np.abs(x - y).sum()

    # 거리 -> 유사도
    euclidean_sim = 1 / (1 + euclidean_dist)
    manhattan_sim = 1 / (1 + manhattan_dist)

    return {
        "cosine_similarity": cos_sim,
        "euclidean_similarity": euclidean_sim,
        "manhattan_similarity": manhattan_sim,
    }

# 벡터 유클리드 정규화
def normalization(x):
    v = np.array(x)
    norm_v = np.sqrt(np.sum(v**2))
    u = v / norm_v
    return u

# 사용 예시
if __name__ == "__main__":
    # JSON 파일에서 벡터 데이터 로드
    json_file_path = '/Users/gyhn/vector-similarities/public/song_data_advanedGenre.json'
    song_vectors = load_song_vectors(json_file_path)

    # 비교할 두 노래 제목
    song1_title = "PH-QWER .mp3"
    song2_title = "JH-Autumn Leaves.mp3"

    # 제목으로 벡터 가져오기
    v1 = song_vectors.get(song1_title)
    v2 = song_vectors.get(song2_title)

    if v1 is not None and v2 is not None:
        print(f"'{song1_title}'와 '{song2_title}'의 유사도 비교:\n")
        
        print('--- 정규화하지 않은 유사도 ---')
        result = vector_similarity(v1, v2)
        for name, value in result.items():
            print(f"{name}: {round(value, 4) * 100}%")
            
        print('\n--- 정규화한 유사도 ---')
        result_norm = vector_similarity(normalization(v1), normalization(v2))
        for name, value in result_norm.items():
            print(f"{name}: {round(value, 4) * 100}%")
    else:
        if v1 is None:
            print(f"오류: '{song1_title}'을(를) 파일에서 찾을 수 없습니다.")
        if v2 is None:
            print(f"오류: '{song2_title}'을(를) 파일에서 찾을 수 없습니다.")
