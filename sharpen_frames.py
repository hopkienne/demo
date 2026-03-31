import argparse
import glob
import os

import cv2


def process_image(image_path: str, output_dir: str, h: int, sigma: float, amount: float) -> None:
    image = cv2.imread(image_path)
    if image is None:
        print(f"Skip unreadable file: {image_path}")
        return

    denoised = cv2.fastNlMeansDenoisingColored(image, None, h, h, 7, 21)
    blurred = cv2.GaussianBlur(denoised, (0, 0), sigma)
    sharpened = cv2.addWeighted(denoised, amount, blurred, -(amount - 1.0), 0)

    output_path = os.path.join(output_dir, os.path.basename(image_path))
    cv2.imwrite(output_path, sharpened)
    print(f"Saved: {output_path}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Sharpen frames with OpenCV denoise + unsharp mask")
    parser.add_argument(
        "--input-dir",
        default=r"G:\zalo_mini_app\demo-sp\public\frame",
        help="Directory containing input JPG frames",
    )
    parser.add_argument(
        "--output-dir",
        default=r"G:\zalo_mini_app\demo-sp\public\frame_sharp",
        help="Directory to write processed frames",
    )
    parser.add_argument("--h", type=int, default=3, help="Denoise strength")
    parser.add_argument("--sigma", type=float, default=1.2, help="Gaussian blur sigma for unsharp mask")
    parser.add_argument("--amount", type=float, default=1.6, help="Sharpen amount; 1.0 disables sharpening")
    args = parser.parse_args()

    os.makedirs(args.output_dir, exist_ok=True)
    patterns = ["*.jpg", "*.jpeg", "*.png"]
    files = []
    for pattern in patterns:
        files.extend(glob.glob(os.path.join(args.input_dir, pattern)))
    files = sorted(files)

    if not files:
        print(f"No image files found in: {args.input_dir}")
        return

    for image_path in files:
        process_image(image_path, args.output_dir, args.h, args.sigma, args.amount)

    print(f"Done. Processed {len(files)} files into {args.output_dir}")


if __name__ == "__main__":
    main()
